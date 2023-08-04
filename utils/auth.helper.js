import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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

		return {
			verified: true,
			response: null,
		};
	} catch (error) {
		throw new Error(`verifyToken - ${error.message}`);
	}
};
