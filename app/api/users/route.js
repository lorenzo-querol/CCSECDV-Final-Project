import connectToDatabase from "@/utils/database";
import User from "@/models/user";

export async function POST(req) {
    try {
        const request = await req.json();
        await connectToDatabase();

        const { email, firstName, lastName, password, phoneNumber } = request;

        const user = new User({
            email,
            firstName,
            lastName,
            password,
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
