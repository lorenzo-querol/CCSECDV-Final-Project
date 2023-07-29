import { NextResponse } from "next/server";
import { database } from "@/utils/database";
import { getLogger } from "@/utils/logger";

// Matches /api/users/[user_id]/liked-posts/[post_id]
// HTTP methods: POST, DELETE
// Adds or removes a post from a user's liked posts

export async function POST(req, { params }) {
	const logger = getLogger();

	try {
		const { post_id, user_id } = params;

		const query = `
            INSERT INTO liked_posts (post_id, user_id)
            VALUES (?, ?);
        `;

		await database.connect();
		await database.query(query, [post_id, user_id]);
		await database.end();

		return NextResponse.json({
			error: null,
			status: 200,
			ok: true,
			data: null,
		});
	} catch (error) {
		logger.error(error);
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
		const { post_id, user_id } = params;

		const query = `
            DELETE FROM liked_posts
            WHERE post_id = ? AND user_id = ?;
        `;

		await database.connect();
		const result = await database.query(query, [post_id, user_id]);
		await database.end();

		if (result.affectedRows === 0)
			return NextResponse.json({
				error: "notfound",
				status: 404,
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
		logger.error(error);
		return NextResponse.json({
			error: "internal",
			status: 500,
			ok: false,
			data: null,
		});
	}
}
