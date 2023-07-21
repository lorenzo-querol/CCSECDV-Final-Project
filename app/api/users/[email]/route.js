import { getLogger } from "@/utils/logger";
import { NextResponse } from "next/server";
import { database } from "@/utils/database";
import path from "path";
import fs from "fs";

export async function GET(req, { params }) {
    const logger = getLogger();

    try {
        const { email } = params;

        await database.connect();
        const query =
            "SELECT user_id, email, first_name, last_name, password, phone_num, avatar FROM users WHERE email = ?";
        const result = await database.query(query, [email]);
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
                ...result[0],
                avatar: {
                    ext: path.extname(imagePath),
                    data: base64Image,
                },
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
