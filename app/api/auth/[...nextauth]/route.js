import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/utils/database";
import bcrypt from "bcrypt";

import User from "@/models/user";
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

                const user = await User.findOne({ email: credentials.email });

                if (
                    user &&
                    bcrypt.compareSync(credentials.password, user.password)
                ) {
                    return {
                        id: user._id,
                        email: user.email,
                    };
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async jwt(token, user) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }

            return token;
        },
        async session(session, token) {
            session.user = token;
            return session;
        },
    },
    secret: process.env.JWT_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
