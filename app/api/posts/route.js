import {
    handleGetPosts,
    handleInsertPost,
    handlePostDelete,
} from "@/utils/posts.helper";

import { NextResponse } from "next/server";
import { getLogger } from "@/utils/logger";
import { handleFileUpload } from "@/utils/file.helper";
import { nanoid } from "nanoid";
import sanitizeHtml from "sanitize-html";

const logger = getLogger();

// Matches /api/posts
// HTTP methods: GET, POST, DELETE

export async function GET(req) {
    try {
        const result = await handleGetPosts();

        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: result,
        });
    } catch (error) {
        logger.error(error.message);

        return NextResponse.json({
            error: "Something went wrong.",
            status: 500,
            ok: false,
            data: null,
        });
    }
}

export async function POST(req) {
    try {
        const data = await req.formData();
        const image = data.get("image");
        let postInfo = JSON.parse(data.get("postInfo"));

        if (postInfo.description.length > 180) {
            throw new Error(
                `[${new Date().toLocaleString()}] Invalid submission: description is too long.`
            );
        }
        if (image === undefined || image === null) {
            postInfo.image = null;
        } else {
            postInfo.image = await handleFileUpload(image, "post");
        }

        const post = {
            post_id: nanoid(),
            user_id: postInfo.user_id,
            name: sanitizeHtml(postInfo.name),
            description: sanitizeHtml(postInfo.description),
            image: postInfo.image,
            date_created: new Date(),
        };

        await handleInsertPost(post);

        logger.info(`${post.name} created post (id: ${post.post_id}).`);

        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: null,
        });
    } catch (error) {
        logger.error(error.message);

        return NextResponse.json({
            error: "Something went wrong.",
            status: 500,
            ok: false,
            data: null,
        });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { post_id } = params;

        await handlePostDelete(post_id);
        await handleFileDelete(result[0].image);

        logger.info(`Post (id: ${post_id}) deleted.`);

        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: null,
        });
    } catch (error) {
        logger.error(error.message);

        return NextResponse.json({
            error: "Something went wrong.",
            status: 500,
            ok: false,
            data: null,
        });
    }
}
