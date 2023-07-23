import { NextResponse } from "next/server";
import { database } from "@/utils/database";
import fs from "fs";
import { getLogger } from "@/utils/logger";
import { getToken } from "next-auth/jwt";
import path from "path";

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

		const imagePath = path.join(process.cwd(), result[0].avatar);
		const imageBuffer = fs.readFileSync(imagePath);
		const base64Image = Buffer.from(imageBuffer).toString("base64");

		return NextResponse.json({
			error: null,
			status: 200,
			ok: true,
			data: {
				avatar: {
					ext: path.extname(imagePath),
					data: base64Image,
				},
				name: `${result[0].first_name} ${result[0].last_name}`,
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
