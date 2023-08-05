import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_ROUTES = [
    { method: "GET", pathname: "/api/users" },
    { method: "GET", pathname: "/api/reports" },
];

export const verifyToken = async (req) => {
    try {
        const token = await getToken({ req });

        if (!token) {
            return {
                verified: false,
                response: NextResponse.json({
                    error: "Unauthorized access",
                    status: 403,
                    ok: false,
                    data: null,
                }),
            };
        }

        // check if token has is_admin property
        // if (!token.is_admin)
        //     // check if the route is admin-only
        //     if (req.nextUrl.pathname.includes("admin")) {

        return {
            verified: true,
            response: null,
        };
    } catch (error) {
        throw new Error(`verifyToken - ${error.message}`);
    }
};
