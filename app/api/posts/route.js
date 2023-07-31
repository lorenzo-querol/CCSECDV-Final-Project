import { database, s3 } from "@/utils/database";
import { Buffer } from 'buffer'
import { NextResponse } from "next/server";
import { getLogger } from "@/utils/logger";
import { nanoid } from "nanoid";
import sanitizeHtml from "sanitize-html";
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
    //console.log(image)
    try {
        const imageData = image == null ? null : image;
 
        
        if (imageData === undefined || imageData === null) {
            const query =
                "INSERT INTO posts (post_id, user_id, name, description, image) VALUES (?, ?, ?, ?, ?)";
            await database.connect();
            await database.query(query, [
                post.post_id,
                post.user_id,
                post.name,
                post.description,
                '',
            ]);

            await database.end();
        } else {
            const query =
                "INSERT INTO posts (post_id, user_id, name, description, image) VALUES (?, ?, ?, ?, ?)";
            await database.connect();
            await database.query(query, [
                post.post_id,
                post.user_id,
                post.name,
                post.description,
                imageData
            ]);
            await database.end();
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const mimeType = await fileTypeFromBuffer(buffer);
            await s3
                .upload({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: post.image,
                    Body: buffer,
                    ContentType: mimeType.mime,
                    ACL: "public-read"
                })
                .promise();
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export async function POST(req) {
    const logger = getLogger();
    const data = await req.json();
    try {
        if (data.description.length > 180 ) 
            throw new Error("Text Length Exceeded")
        let finalImg = "";
        if (data.avatar != null) {
            const image = data.avatar;
            let imageName = image.split(".");
            imageName[0] = nanoid();
            imageName = imageName.join(".");
            finalImg = "avatar_" + imageName;
        } else {
            finalImg = null;
        }
        const { user_id, name, description, image } = data;

        const post = {
            post_id: nanoid(),
            user_id: user_id,
            name: sanitizeHtml(name),
            description: sanitizeHtml(description),
            heart_count: 0,
        };

        savePost(post, image);

        logger.info(
            `User ${post.name} (id: ${post.user_id}) created a post with id ${post.post_id}.`
        );
        const tempdate = new Date();
        const date_created = tempdate.toISOString();
        const final_post = {
            post_id: nanoid(),
            user_id: user_id,
            name: name,
            description: description,
            heart_count: 0,
            date_created: date_created,
            avatar: data.avatar,
        };
        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: final_post,
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
