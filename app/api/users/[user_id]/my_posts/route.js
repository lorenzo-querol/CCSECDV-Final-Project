import { NextResponse } from "next/server";
import { database } from "@/utils/database";
import { getLogger } from "@/utils/logger";

// Matches /api/users/[user_id]/my_posts
// HTTP methods: GET
// Gets all posts of a user

// TODO: Under construction
export async function GET(req, { params }) {
    const logger = getLogger();

    try {
        const { user_id } = params;
        const query = `
            SELECT
                p.user_id,
                p.post_id, 
                p.date_created, 
                p.name, 
                p.description, 
                p.image, 
                p.heart_count, 
                u.avatar
            FROM 
                posts p
            JOIN 
                users u ON p.user_id = u.user_id
            WHERE 
                p.user_id = ?
            ORDER BY
                p.date_created DESC
        `;

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
