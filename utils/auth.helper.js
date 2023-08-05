import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_ROUTES = [
	{ method: ["GET"], pathname: "/api/users" },
	{ method: ["GET", "POST", "PUT", "DELETE"], pathname: "/api/reports" },
];

const checkTokenExists = (token) => {
	return token !== null;
};

const verifyAdminRoute = (token, req) => {
	const isAdminApiRoute = ADMIN_ROUTES.some((route) => {
		const isMethodMatch = route.method.includes(req.method);
		const isPathnameMatch = route.pathname === req.nextUrl.pathname;

		return isMethodMatch && isPathnameMatch;
	});

	return !(isAdminApiRoute && !token.is_admin);
};

const verifyUserId = (token, user_id) => {
	return token.user_id === user_id;
};

const verifyAdmin = (token) => {
	return token.is_admin;
};

const unauthorizedResponse = () => {
	return {
		verified: false,
		response: NextResponse.json({
			error: "Unauthorized access",
			status: 403,
			ok: false,
			data: null,
		}),
	};
};

export const verifyToken = async (req, user_id = "") => {
	try {
		const token = await getToken({ req });

		if (!checkTokenExists(token)) return unauthorizedResponse();
		if (!verifyAdminRoute(token, req)) return unauthorizedResponse();

		// This bypasses the user_id check if the user is an admin
		if (!verifyAdmin(token))
			if (!verifyUserId(token, user_id)) return unauthorizedResponse();

		return {
			verified: true,
			response: null,
		};
	} catch (error) {
		throw new Error(`verifyToken - ${error.message}`);
	}
};
