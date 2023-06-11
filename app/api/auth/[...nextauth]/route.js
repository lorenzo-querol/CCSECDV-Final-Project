import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/utils/database";

// TODO Set up authentication with the database.
export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                await connectToDatabase();

                const User = mongoose.model("User");

                const user = await User.findOne({ email: credentials.email });
                if (user && user.password === credentials.password) {
                    return Promise.resolve(user);
                }

                return Promise.resolve(null);
            },
        }),
    ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
