import {
	handleDeleteLikedPost,
	handleInsertLikedPost,
} from "@/utils/users.helper";

import { NextResponse } from "next/server";
import { getLogger } from "@/utils/logger";
import { verifyToken } from "@/utils/auth.helper";

const logger = getLogger();

// Matches /api/users/[user_id]/liked-posts/[post_id]
// HTTP methods: POST, DELETE

export async function POST(req, { params }) {
	try {
		const { post_id, user_id } = params;

		const { verified, response } = await verifyToken(req, user_id);
		if (!verified) return response;

		await handleInsertLikedPost(post_id, user_id);

		return NextResponse.json({
			error: null,
			status: 200,
			ok: true,
			data: null,
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
}

export async function DELETE(req, { params }) {
	try {
		const { post_id, user_id } = params;

		const { verified, response } = await verifyToken(req, user_id);
		if (!verified) return response;

		await handleDeleteLikedPost(post_id, user_id);

		return NextResponse.json({
			error: null,
			status: 200,
			ok: true,
			data: null,
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
}
