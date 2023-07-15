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

export async function POST(req) {
    try {
        await connectToDatabase();

        const data = await req.formData();
        const userInfo = JSON.parse(data.get("userInfo"));
        const avatar = data.get("avatar");

        const { email, firstName, lastName, password, phoneNumber } = userInfo;
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with internally generated salt
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

        // Prepare the avatar for saving
        const bytes = await avatar.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const path = `${process.cwd()}/tmp/${avatar.name}`;

        // Save the avatar and user to the filesystem
        await writeFile(path, buffer);
        await user.save();

        return new Response(
            { message: "User created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.log(`[${new Date().toLocaleString()}]`, error.message);
        return new Response(
            { message: "Error creating user" },
            { status: 500 }
        );
    }
}
