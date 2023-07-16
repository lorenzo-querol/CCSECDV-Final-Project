import bcrypt from "bcrypt";
import sanitizeHtml from "sanitize-html";
import { writeFile } from "fs/promises";
import { Buffer } from "buffer";
import { v4 as uuidv4 } from "uuid";

import { database } from "@/utils/database";
import { getLogger } from "@/utils/logger";

// Turn off body parsing, and instead use the raw body
export const config = {
    api: {
        bodyParser: false,
    },
};

/**
 * Check if the password is valid through regex validation
 * @param {*} password The password of the user
 * @param {*} confirmPassword The confirmation password of the user
 * @returns True if the password is valid, false otherwise
 */
const checkPassword = (password, confirmPassword) => {
    if (confirmPassword) return password === confirmPassword;

    const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?!.*\s).{12,64}$/;
    return passwordRegex.test(password);
};

/**
 * Validate data through regex validation
 * @param {*} firstName The first name of the user
 * @param {*} lastName The last name of the user
 * @param {*} phoneNumber The phone number of the user
 * @param {*} email The email of the user
 * @returns True if the data is valid, false otherwise
 */
const validateData = (firstName, lastName, phoneNumber, email) => {
    const nameRegex = /^[\w\s\u00C0-\u017F]{2,}$/;
    const phoneRegex = /^\s*09\d{9}\s*$/;
    const emailRegex =
        /^[\w.\-]+[a-zA-Z0-9]*@[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;

    return (
        nameRegex.test(firstName) &&
        nameRegex.test(lastName) &&
        phoneRegex.test(phoneNumber) &&
        emailRegex.test(email)
    );
};

/**
 * Save the user to the database and the avatar to the file system
 * @param {*} user The user object
 * @param {*} avatar A string containing the avatar path
 */
async function saveUser(user, avatar) {
    try {
        // 1. Prepare the avatar for saving to the file system
        const bytes = await avatar.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const path = `${process.cwd()}/${user.avatar}`;

        // 2. Save the avatar to the file system and user to the database
        await writeFile(path, buffer);

        // 3. Prepare the query
        const query =
            "INSERT INTO users (email, first_name, last_name, password, phone_num, avatar) VALUES (?, ?, ?, ?, ?, ?)";

        // 4. Connect to database
        await database.connect();

        // 5. Execute the query
        await database.query(query, [
            user.email,
            user.firstName,
            user.lastName,
            user.password,
            user.phoneNumber,
            user.avatar,
        ]);

        // 6. Close the connection
        await database.end();
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function POST(req) {
    const logger = getLogger();

    try {
        // 1. Parse the form data
        const data = await req.formData();
        const userInfo = JSON.parse(data.get("userInfo"));

        // EXTRA: Replace the avatar name with a UUID but keep the extension
        let avatar = data.get("avatar");
        let avatarName = avatar.name.split(".");
        avatarName[0] = uuidv4();
        avatarName = avatarName.join(".");

        // 2. Extract the user info
        const {
            email,
            firstName,
            lastName,
            password,
            phoneNumber,
            confirmPassword,
        } = userInfo;

        // 3. Check if the passwords match and the data is valid
        if (!checkPassword(password, confirmPassword)) {
            logger.error("Passwords do not match");
            return new Response(
                { message: "User creation failed" },
                { status: 500 }
            );
        }

        if (!validateData(firstName, lastName, phoneNumber, email)) {
            logger.error("Invalid data");
            return new Response(
                { message: "User creation failed" },
                { status: 500 }
            );
        }

        // 4. Hash the password and create the user object with sanitization
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            email: sanitizeHtml(email.trim()),
            firstName: sanitizeHtml(firstName.trim()),
            lastName: sanitizeHtml(lastName.trim()),
            password: hashedPassword,
            phoneNumber: sanitizeHtml(phoneNumber.trim()),
            avatar: "avatars/" + avatarName,
        };

        // 5. Save the user
        await saveUser(user, avatar);

        logger.info("User creation successful");
        return new Response(
            { message: "User creation successful" },
            { status: 201 }
        );
    } catch (error) {
        logger.error(error.message);
        return new Response(
            { message: "User creation failed" },
            { status: 500 }
        );
    }
}

async function retrieveUser(email, password) {
    const user = await User.find({ email }).exec();
    const pwCheck = await bcrypt.compare(password, user[0].password);
    if (pwCheck)
        return new Response({ message: "Successful login. " }, { status: 201 });

    return new Response({ message: "Error login user." }, { status: 401 });
}

export async function GET(req) {
    try {
        await connectToDatabase();
        const url = new URL(req.url);
        const email = url.searchParams.get("email");
        const password = url.searchParams.get("password");
        if (!email || !password) {
            return new Response({ message: "Invalid login" }, { status: 500 });
        }

        return await retrieveUser(email, password);
    } catch (error) {
        return new Response(
            { message: "Internal Server Error." },
            { status: 500 }
        );
    } finally {
        console.log("GET REQUEST FINISHED");
    }
}

async function retrieveUsers(req, res) {
    try {
        console.log("HELLO");
        const users = await User.findall().exec();

        const formattedUsers = users.map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
        }));
        console.log(formattedUsers);

        res.status(200).json({
            message: "Successfully retrieved users.",
            users: formattedUsers,
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users." });
    }
}
