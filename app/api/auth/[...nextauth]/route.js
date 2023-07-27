import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { database } from "@/utils/database";
import { getLogger } from "@/utils/logger";
import rateLimit from "@/utils/rate_limit";

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second
});

const authHandler = async (req, res) => {
    const logger = getLogger();

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
                        // 1. Copy headers to response because NextAuth modifies them
                        const requestHeaders = new Headers(req.headers);
                        res = NextResponse.next({
                            request: {
                                headers: requestHeaders,
                            },
                        });

                        // 2. Check if too many requests are being made
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

                        // 3. Check if the user exists
                        const query =
                            "SELECT user_id, first_name, last_name, email, password, is_admin, cooldown_until, avatar FROM users WHERE email = ?";

                        await database.connect();
                        const user = await database.query(query, [
                            credentials.email,
                        ]);
                        await database.end();

                        // 4. If the user exists, check if the password matches
                        const samePassword = await bcrypt.compare(
                            credentials.password,
                            user[0].password
                        );

                        // 5. If the password matches, return the user object
                        if (user && samePassword) {
                            return {
                                user_id: user[0].user_id,
                                email: user[0].email,
                                name: `${user[0].first_name} ${user[0].last_name}`,
                                is_admin: user[0].is_admin,
                                cooldown_until: user[0].cooldown_until,
                                avatar: user[0].avatar,
                            };
                        }

                        return null;
                    },
                }),
            ],
            callbacks: {
                async jwt({ token, user }) {
                    if (user) {
                        token.user_id = user.user_id;
                        token.email = user.email;
                        token.name = user.name;
                        token.is_admin = user.is_admin;
                        token.cooldown_until = user.cooldown_until;
                        token.avatar = user.avatar;
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
            error: "internal",
            status: 500,
            ok: false,
            data: null,
        });
    }
};

export { authHandler as GET, authHandler as POST };
