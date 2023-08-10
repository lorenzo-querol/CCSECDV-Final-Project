import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { database } from '@/utils/database';
import logger from '@/utils/logger';
import rateLimit from '@/utils/rate_limit';

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second
});

const authHandler = async (req, res) => {
    try {
        return await NextAuth(req, res, {
            providers: [
                CredentialsProvider({
                    name: 'Credentials',
                    credentials: {
                        email: { label: 'Email', type: 'text' },
                        password: { label: 'Password', type: 'password' },
                    },

                    authorize: async credentials => {
                        // Copy headers to response because NextAuth modifies them
                        const requestHeaders = new Headers(req.headers);
                        res = NextResponse.next({
                            request: {
                                headers: requestHeaders,
                            },
                        });

                        // Check if too many requests are being made
                        const { rateLimited, remaining } = await limiter.check(res, 10, 'CACHE_TOKEN');

                        // Throw an error if limit is reached
                        if (rateLimited) throw new Error('Too many requests, please try again later.');

                        // Check if the user exists
                        await database.connect();
                        const result = await database.query(
                            `
                                SELECT *
                                FROM users WHERE email = ?
                            `,
                            [credentials.email],
                        );
                        await database.end();

                        // Check if the user exists
                        if (result.length === 0) {
                            logger.warn(
                                { url: req.nextUrl, method: req.method, credentials: credentials },
                                `[WARN] authHandler - User cannot be found`,
                            );
                            return null;
                        }

                        const user = result[0];

                        // Check if the password doesn't match
                        if (!(await bcrypt.compare(credentials.password, user.password))) {
                            logger.warn(
                                {
                                    url: req.nextUrl,
                                    method: req.method,
                                    credentials: credentials,
                                },
                                `[WARN] authHandler - User (id: ${user.user_id}) failed to login`,
                            );
                            return null;
                        }

                        logger.info(
                            {
                                url: req.nextUrl,
                                method: req.method,
                                info: {
                                    user_id: user.user_id,
                                    is_admin: user.is_admin,
                                },
                            },
                            `[SUCCESS] authHandler - User (id: ${user.user_id}) logged in successfully`,
                        );

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

            /**
             * NOTE Reference: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#Session_Expiration
             * Since idle timeout is not implemented in the web app, a shorter session duration is used instead to prevent session hijacking
             * For the session and jwt max age, it is set to 30 minutes
             */
            session: {
                maxAge: 30 * 60,
            },
            jwt: {
                maxAge: 30 * 60,
            },

            callbacks: {
                async jwt({ token, user, trigger }) {
                    // This triggers when user updates details in the settings so it updates the token
                    if (trigger === 'update') {
                        await database.connect();
                        const result = await database.query(
                            `
                                SELECT *
                                FROM users WHERE user_id = ?
                            `,
                            [token.user_id],
                        );
                        await database.end();

                        token.user_id = result[0].user_id;
                        token.email = result[0].email;
                        token.name = `${result[0].first_name} ${result[0].last_name}`;
                        token.avatar = result[0].avatar;
                        if (result[0].is_admin) token.is_admin = result[0].is_admin;
                        if (result[0].cooldown_until) token.cooldown_until = result[0].cooldown_until;

                        logger.info(
                            {
                                url: req.nextUrl,
                                method: req.method,
                                token: token,
                            },
                            `[SUCCESS] authHandler - User (id: ${token.user_id}) updated details, refreshing token`,
                        );
                    }

                    if (user) {
                        token.user_id = user.user_id;
                        token.email = user.email;
                        token.name = user.name;
                        token.avatar = user.avatar;
                        if (user.is_admin) token.is_admin = user.is_admin;
                        if (user.cooldown_until) token.cooldown_until = user.cooldown_until;
                    }

                    return token;
                },
                async session({ session, token }) {
                    session.user.user_id = token.user_id;
                    session.user.email = token.email;
                    session.user.name = token.name;
                    session.user.avatar = token.avatar;
                    if (token.is_admin) session.user.is_admin = token.is_admin;
                    if (token.cooldown_until) session.user.cooldown_until = token.cooldown_until;

                    return session;
                },
            },
            pages: {
                signIn: '/login',
            },
        });
    } catch (error) {
        logger.error(
            {
                url: req.nextUrl,
                method: req.method,
                error: error.stack,
            },
            `[ERROR] ${error.message}`,
        );

        return NextResponse.json({
            error: 'Something went wrong',
            status: 500,
            ok: false,
            data: null,
        });
    }
};

export { authHandler as GET, authHandler as POST };
