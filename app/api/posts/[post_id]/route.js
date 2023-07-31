import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { database } from "@/utils/database";
import { getLogger } from "@/utils/logger";
import { s3 } from "@/utils/database";

var assert = require("assert");

export async function PUT(req, { params }) {
    const logger = getLogger();

    try {
        const { heart_count } = await req.json();
        const { post_id } = params;

        // NOTE heart_count can only be 1 or -1, else throw invalid error
        const heart_count_int = parseInt(heart_count, 10);
        assert(heart_count_int === 1 || heart_count_int === -1, "invalid");

        await database.connect();
        const result = await database.query(
            `
                UPDATE posts SET heart_count = heart_count + ? 
                WHERE post_id = ?
            `,
            [heart_count_int, post_id]
        );
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
        if (error.message === "invalid")
            return NextResponse.json({
                error: "invalid",
                status: 400,
                ok: false,
                data: null,
            });

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
        const { post_id } = params;

        await database.connect();

        const result = await database.query(
            `SELECT image FROM posts WHERE post_id = ?`,
            [post_id]
        );
        await database.query(`DELETE FROM posts WHERE post_id = ?`, [post_id]);
        await database.query(`DELETE FROM liked_posts WHERE post_id = ?`, [
            post_id,
        ]);

        await database.end();

        const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: result[0].image,
        });
        await s3.send(command);

        logger.info(`Post ${post_id} deleted.`);
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
