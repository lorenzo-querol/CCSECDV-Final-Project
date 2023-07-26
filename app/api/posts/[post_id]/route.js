import { NextResponse } from "next/server";
import { database } from "@/utils/database";
import { getLogger } from "@/utils/logger";

export async function PUT(req, { params }) {
    const logger = getLogger();

    try {
        const { heart_count } = await req.json();
        const { post_id } = params;

        const query = "UPDATE posts SET heart_count = ? WHERE post_id = ?";

        await database.connect();
        const result = await database.query(query, [heart_count, post_id]);
        await database.end();

        if (result.affectedRows === 0)
            return NextResponse.json({
                error: "notfound",
                status: 404,
                ok: false,
                data: null,
            });

        logger.info(`Post ${post_id} updated.`);
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
