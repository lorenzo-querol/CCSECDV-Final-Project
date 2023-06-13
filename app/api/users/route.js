import connectToDatabase from "@/utils/database";
import User from "@/models/user";
import bcrypt from "bcrypt";
import sanitizeHtml from "sanitize-html";

export async function POST(req) {
    try {
        const request = await req.json();
        await connectToDatabase();

        const { email, firstName, lastName, password, phoneNumber } = request;
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with internally generated salt

        const user = new User({
            email: sanitizeHtml(email.trim()),
            firstName: sanitizeHtml(firstName.trim()),
            lastName: sanitizeHtml(lastName.trim()),
            password: hashedPassword,
            phoneNumber: sanitizeHtml(phoneNumber.trim()),

        });

        await user.save();

        return new Response(
            { message: "User created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.log(`[${new Date().toLocaleString()}]`, error.message);
        return new Response(
            { message: "Error creating user." },
            { status: 500 }
        );
    }
}
