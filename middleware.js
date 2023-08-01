import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

async function authenticateAndAuthorize(req) {
    const token = await getToken({ req });
    if (!token) return { isAuthenticated: false };

    let { is_admin } = token;
    const isAdmin = parseInt(is_admin, 10) === 1;

    return { isAuthenticated: true, isAdmin };
}

function redirectLogin(req) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.rewrite(url);
}

function redirectAdmin(req) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/list-users";
    return NextResponse.rewrite(url);
}

export async function middleware(req) {
    const { pathname } = req.nextUrl;
    const requiresAuth =
        pathname.startsWith("/home") || pathname.startsWith("/admin");
    const requiresAdmin = pathname.startsWith("/admin");

    if (!requiresAuth) return NextResponse.next();

    const { isAuthenticated, isAdmin } = await authenticateAndAuthorize(req);

    if (!isAuthenticated) return redirectLogin(req);

    if (isAdmin && !pathname.startsWith("/admin")) return redirectAdmin(req);

    if (requiresAdmin && !isAdmin) {
        return new NextResponse(
            JSON.stringify({
                error: "unauthorized",
                status: 401,
                ok: false,
                data: null,
            })
        );
    }

    return NextResponse.next();
}
