import { NextResponse } from "next/server";
import { getLogger } from "@/utils/logger";
import { handleGetLikedPosts } from "@/utils/users.helper";

const logger = getLogger();

// Matches /api/users/[user_id]/liked-posts
// HTTP methods: GET

export async function GET(req, { params }) {
    try {
        const { user_id } = params;

        const result = await handleGetLikedPosts(user_id);

        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: result,
        });
    } catch (error) {
        logger.error(error);

        return NextResponse.json({
            error: "Something went wrong.",
            status: 500,
            ok: false,
            data: null,
        });
    }
}
