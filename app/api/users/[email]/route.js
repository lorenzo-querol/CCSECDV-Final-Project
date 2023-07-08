import User from "@/models/user";

export async function GET(req) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        const user = User.findOne({ email });

        if (!user)
            return new Response({ message: "User not found" }, { status: 404 });

        return new Response({ message: "User found" }, { status: 200 });
    } catch (error) {
        console.log(`[${new Date().toLocaleString()}]`, error.message);
        return new Response({ message: "Error finding user" }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        
    } catch (error) {
        console.log(`[${new Date().toLocaleString()}]`, error.message);
        return new Response(
            { message: "Error updating user" },
            { status: 500 }
        );
    }
}
