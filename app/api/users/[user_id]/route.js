import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { sanitizeObject, validateData } from "@/utils/validation.helper";

import { Buffer } from "buffer";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { database } from "@/utils/database";
import { fileTypeFromBuffer } from "file-type";
import { getLogger } from "@/utils/logger";
import { nanoid } from "nanoid";
import { s3 } from "@/utils/database";

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

export async function PUT(req, { params }) {
    const logger = getLogger();

    try {
        const { user_id } = params;
        const data = await req.formData();
        const avatar = data.get("avatar");
        let updatedInfo = JSON.parse(data.get("updatedInfo"));
        updatedInfo = sanitizeObject(updatedInfo);

        if (
            !validateData(
                updatedInfo.firstName,
                updatedInfo.lastName,
                updatedInfo.phoneNumber,
                updatedInfo.email
            )
        )
            throw new Error("invalid");

        await database.connect();

        const userQuery = "SELECT * FROM users WHERE user_id = ?";
        const userResult = await database.query(userQuery, [user_id]);
        if (userResult.length === 0) throw new Error("notfound");

        const currentInfo = userResult[0];

        // Check if user updated avatar, if so, update the avatar name, else, use the current avatar name
        if (avatar !== "undefined") {
            let avatarName = avatar.name.split(".");
            avatarName[0] = nanoid();
            avatarName = avatarName.join(".");
            updatedInfo.avatar = "avatar_" + avatarName;

            // Delete current avatar from s3
            const deleteCommand = new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: currentInfo.avatar,
            });

            await s3.send(deleteCommand);

            // Upload new avatar to s3
            const bytes = await avatar.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const mimeType = await fileTypeFromBuffer(buffer);

            const putCommand = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: updatedInfo.avatar,
                Body: buffer,
                ContentType: mimeType.mime,
                ACL: "public-read",
            });

            await s3.send(putCommand);
        } else {
            updatedInfo.avatar = currentInfo.avatar;
        }

        // Check if user updated password, if so, hash it, else, use the current password
        if (updatedInfo.password !== currentInfo.password) {
            const hashedPassword = await bcrypt.hash(updatedInfo.password, 10);
            updatedInfo.password = hashedPassword;
        } else {
            updatedInfo.password = currentInfo.password;
        }

        const updateQuery =
            "UPDATE users SET first_name = ?, last_name = ?, phone_num = ?, email = ?, password = ?, avatar = ? WHERE user_id = ?";
        const updateResult = await database.query(updateQuery, [
            updatedInfo.firstName,
            updatedInfo.lastName,
            updatedInfo.phoneNumber,
            updatedInfo.email,
            updatedInfo.password,
            updatedInfo.avatar,
            user_id,
        ]);

        await database.end();

        logger.info(`User ${updatedInfo.email} (id: ${user_id}) updated.`);
        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: null,
        });
    } catch (error) {
        logger.error(error.message);

        if (error.message === "notfound")
            return NextResponse.json({
                error: "Data not found.",
                status: 404,
                ok: false,
                data: null,
            });

        if (error.message === "invalid")
            return NextResponse.json({
                error: "Invalid data. Please check your input.",
                status: 400,
                ok: false,
                data: null,
            });

        return NextResponse.json({
            error: "Internal server error. Please try again later.",
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

        await database.connect();

        const userQuery = "DELETE FROM users WHERE user_id = ?";
        const postQuery = "DELETE FROM posts WHERE user_id = ?";
        const likedQuery = "DELETE FROM liked_posts WHERE user_id = ?";
        const reportQuery = "DELETE FROM reports WHERE user_id = ?";

        const userResult = await database.query(userQuery, [user_id]);
        const postResult = await database.query(postQuery, [user_id]);
        const likedResult = await database.query(likedQuery, [user_id]);
        const reportResult = await database.query(reportQuery, [user_id]);

        await database.end();

        logger.info(`User ${user_id} deleted.`);
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
