import { NextResponse } from "next/server";
import { database } from "@/utils/database";
import { getLogger } from "@/utils/logger";

// Matches /api/profile/[user_id]
// HTTP methods: GET, PATCH, DELETE

export async function GET(req, { params }) {
    const logger = getLogger();
    try {
        const { user_id } = params;

        const query =
            "SELECT post_id, date_created, name, description, image, heart_count FROM posts WHERE user_id = ?";

        await database.connect();
        const result = await database.query(query, [user_id]);
        await database.end();

        if (result.length === 0)
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
            data: result,
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
