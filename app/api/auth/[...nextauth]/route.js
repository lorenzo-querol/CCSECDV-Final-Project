import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { database } from "@/utils/database";
import { getLogger } from "@/utils/logger";
import rateLimit from "@/utils/rate_limit";

const logger = getLogger();

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second
});

const authHandler = async (req, res) => {
    try {
        return await NextAuth(req, res, {
            providers: [
                CredentialsProvider({
                    name: "Credentials",
                    credentials: {
                        email: { label: "Email", type: "text" },
                        password: { label: "Password", type: "password" },
                    },
                    authorize: async (credentials) => {
                        // Copy headers to response because NextAuth modifies them
                        const requestHeaders = new Headers(req.headers);
                        res = NextResponse.next({
                            request: {
                                headers: requestHeaders,
                            },
                        });

                        // Check if too many requests are being made
                        const { rateLimited, remaining } = await limiter.check(
                            res,
                            10,
                            "CACHE_TOKEN"
                        );

                        // Throw an error if limit is reached
                        if (rateLimited)
                            throw new Error(
                                "Too many requests, please try again later."
                            );

                        // Check if the user exists
                        await database.connect();
                        const result = await database.query(
                            `
                                SELECT *
                                FROM users WHERE email = ?
                            `,
                            [credentials.email]
                        );
                        const user = result[0];
                        await database.end();

                        // If the user exists, check if the password matches
                        const samePassword = await bcrypt.compare(
                            credentials.password,
                            user.password
                        );

                        // If the password matches
                        if (!user && !samePassword) return null;

                        return {
                            user_id: user.user_id,
                            email: user.email,
                            name: `${user.first_name} ${user.last_name}`,
                            is_admin: user.is_admin,
                            cooldown_until: user.cooldown_until,
                            avatar: user.avatar,
                        };
                    },
                }),
            ],
            callbacks: {
                async jwt({ token, user }) {
                    if (user) {
                        token.user_id = user.user_id;
                        token.email = user.email;
                        token.name = user.name;
                        token.avatar = user.avatar;
                        if (user.is_admin) token.is_admin = user.is_admin;
                        if (user.cooldown_until)
                            token.cooldown_until = user.cooldown_until;
                    }

                    return token;
                },
                async session({ session, token }) {
                    session.user.user_id = token.user_id;
                    session.user.email = token.email;
                    session.user.name = token.name;
                    session.user.avatar = token.avatar;
                    if (token.is_admin) session.user.is_admin = token.is_admin;
                    if (token.cooldown_until)
                        session.user.cooldown_until = token.cooldown_until;

                    return session;
                },
            },
            pages: {
                signIn: "/login",
            },
        });
    } catch (error) {
        logger.error(error.message);

        return NextResponse.json({
            error: "Something went wrong",
            status: 500,
            ok: false,
            data: null,
        });
    }
};

export { authHandler as GET, authHandler as POST };
