import connectToDatabase from "@/utils/database";
import User from "@/models/user";
import bcrypt from "bcrypt";
import sanitizeHtml from "sanitize-html";
import { writeFile } from "fs/promises";
import { Buffer } from "buffer";

// Turn off body parsing, and instead use the raw body
export const config = {
    api: {
        bodyParser: false,
    },
};

const checkPassword = (password, confirmPassword) => {
    if (confirmPassword) {
        return password === confirmPassword;
    }

    const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?!.*\s).{12,64}$/;
    return passwordRegex.test(password);
};

const isValidData = (firstName, lastName, phoneNumber, email) => {
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

async function saveUser(user, avatar) {
    // Prepare the avatar for saving
    const bytes = await avatar.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = `${process.cwd()}/tmp/${avatar.name}`;

    // Save the avatar and user to the filesystem
    await writeFile(path, buffer);
    await user.save();
}

export async function POST(req) {
    try {
        await connectToDatabase();

        const data = await req.formData();
        const userInfo = JSON.parse(data.get("userInfo"));
        const avatar = data.get("avatar");

        const {
            email,
            firstName,
            lastName,
            password,
            phoneNumber,
            confirmPassword,
        } = userInfo;

        if (!checkPassword(password, confirmPassword)) {
            console.log(`[${new Date().toLocaleString()}]`);
            return new Response(
                { message: "Error creating user. " },
                { status: 500 }
            );
        }

        if (!isValidData(firstName, lastName, phoneNumber, email)) {
            return new Response(
                { message: "Error creating user." },
                { status: 401 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email: sanitizeHtml(email.trim()),
            firstName: sanitizeHtml(firstName.trim()),
            lastName: sanitizeHtml(lastName.trim()),
            password: hashedPassword,
            phoneNumber: sanitizeHtml(phoneNumber.trim()),
            avatar: {
                data: "/tmp/" + avatar.name,
                contentType: avatar.type,
            },
        });

        await saveUser(user, avatar);

        console.log(
            `[${new Date().toLocaleString()}]`,
            "Successfully created user. "
        );
        return new Response(
            { message: "Successfully created user." },
            { status: 201 }
        );
    } catch (error) {
        console.log(`[${new Date().toLocaleString()}]`, error.message);
        return new Response({ message: error.message }, { status: 500 });
    }
}

async function retrieveUser(email, password) {
    const user = await User.find({ email, password }).exec();
    if (user.length !== 0) {
        return new Response({ message: "Successful login. " }, { status: 201 });
    }

    return new Response({ message: "Error login user." }, { status: 401 });
}

export async function GET(req) {
    try {
        await connectToDatabase();
        const url = new URL(req.url);
        const email = url.searchParams.get("email");
        const password = url.searchParams.get("password");

        console.log(email);
        console.log(password);
        if (!email || !password) {
            return new Response({ message: "Invalid login" }, { status: 500 });
        }
        return await retrieveUser(email, password);
    } catch (error) {
        return new Response(
            { message: "Internal Server Error. " },
            { status: 500 }
        );
    } finally {
        console.log("GET REQUEST FINISHED");
    }
}
