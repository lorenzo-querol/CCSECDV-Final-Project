import { NextResponse } from "next/server";
import { database } from "@/utils/database";
import { getLogger } from "@/utils/logger";

// Matches /api/users/[user_id]
// HTTP methods: GET, PATCH, DELETE

export async function GET(req, { params }) {
	const logger = getLogger();
	try {
		const { user_id } = params;

		const query =
			"SELECT email, first_name, last_name, password, phone_num, avatar FROM users WHERE user_id = ?";

		await database.connect();
		const result = await database.query(query, [user_id]);
		await database.end();

		if (result.length === 0)
			return NextResponse.json({
				error: "notfound",
				status: 400,
				ok: false,
				data: null,
			});

		return NextResponse.json({
			error: null,
			status: 200,
			ok: true,
			data: result[0],
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
}

export async function PATCH(req, { params }) {
	const logger = getLogger();
	try {
		const { email } = params;
	} catch (error) {
		logger.error(error.message);
		return NextResponse.json({
			error: "internal",
			status: 500,
			ok: false,
			data: null,
		});
	}
}

export async function DELETE(req, { params }) {
	const logger = getLogger();

	try {
		const { user_id } = params;
		const query = "DELETE FROM users WHERE user_id = ?";

		await database.connect();
		const result = await database.query(query, [user_id]);
		await database.end();

		if (result.affectedRows === 0)
			return NextResponse.json({
				error: "notfound",
				status: 400,
				ok: false,
				data: null,
			});

		return NextResponse.json({
			error: null,
			status: 200,
			ok: true,
			data: null,
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
}
