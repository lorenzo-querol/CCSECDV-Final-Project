import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { database, s3 } from "@/utils/database";

import { Buffer } from "buffer";
import { NextResponse } from "next/server";
import { fileTypeFromBuffer } from "file-type";
import { getLogger } from "@/utils/logger";
import { nanoid } from "nanoid";
import sanitizeHtml from "sanitize-html";
import { sanitizeObject } from "@/utils/validation.helper";

// Matches /api/posts
// HTTP methods: GET, POST, DELETE

export async function GET(req) {
    const logger = getLogger();

    try {
        const query = `
            SELECT
                posts.user_id,
                posts.post_id,
                posts.date_created,
                posts.name,
                posts.description,
                posts.image,
                posts.heart_count,
                users.avatar
            FROM
                posts
            JOIN
                users ON posts.user_id = users.user_id
            ORDER BY
                posts.date_created DESC
        `;

        await database.connect();
        const result = await database.query(query);
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

/**
 * Saves the post to the database and uploads the image to Amazon S3
 * @param {*} post The post object
 * @param {*} image The image file
 */

const savePost = async (post, image) => {
    try {
        const query =
            "INSERT INTO posts (post_id, user_id, name, description, image) VALUES (?, ?, ?, ?, ?)";
        await database.connect();
        await database.query(query, [
            post.post_id,
            post.user_id,
            post.name,
            post.description,
            post.image,
        ]);
        await database.end();

        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const mimeType = await fileTypeFromBuffer(buffer);

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: post.image,
            Body: buffer,
            ContentType: mimeType.mime,
            ACL: "public-read",
        });

        await s3.send(command);
    } catch (error) {
        throw new Error(error.message);
    }
};

export async function POST(req) {
    const logger = getLogger();

    try {
        const data = await req.formData();
        const image = data.get("image");
        let postInfo = JSON.parse(data.get("postInfo"));

        if (postInfo.description.length > 180)
            throw new Error("Text Length Exceeded");

        if (image !== "undefined") {
            let imageName = image.name.split(".");
            imageName[0] = nanoid();
            imageName = imageName.join(".");
            postInfo.image = "post_" + imageName;

            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const mimeType = await fileTypeFromBuffer(buffer);

            const putCommand = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: postInfo.image,
                Body: buffer,
                ContentType: mimeType.mime,
                ACL: "public-read",
            });

            await s3.send(putCommand);
        } else {
            postInfo.image = null;
        }

        const post = {
            post_id: nanoid(),
            user_id: postInfo.user_id,
            name: sanitizeHtml(postInfo.name),
            description: sanitizeHtml(postInfo.description),
            image: postInfo.image,
            heart_count: 0,
        };

        savePost(post, image);

        logger.info(
            `User ${post.name} (id: ${post.user_id}) created a post with id ${post.post_id}.`
        );
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

export async function DELETE(req, { params }) {
    const logger = getLogger();

    try {
        const { post_id } = params;

        await database.connect();

        const postQuery = "SELECT image FROM posts WHERE post_id = ?";
        const deletePostQuery = "DELETE FROM posts WHERE post_id = ?";
        const likedPostsQuery = "DELETE FROM liked_posts WHERE post_id = ?";

        await database.query(postQuery, [post_id]);
        await database.query(deletePostQuery, [post_id]);
        await database.query(likedPostsQuery, [post_id]);

        await database.end();

        const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: postQuery[0].image,
        });

        await s3.send(command);

        logger.info(`Post with id ${post_id} deleted.`);
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
