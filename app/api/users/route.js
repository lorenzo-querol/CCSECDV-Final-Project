import connectToDatabase from "@/utils/database";
import User from "@/models/user";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        const request = await req.json();
        await connectToDatabase();

        const { email, firstName, lastName, password, phoneNumber } = request;
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with internally generated salt

        const user = new User({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            phoneNumber,
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
