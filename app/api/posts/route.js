import { handleGetPosts, handleInsertPost } from '@/utils/posts.helper';

import { NextResponse } from 'next/server';
import { handleFileUpload } from '@/utils/file.helper';
import logger from '@/utils/logger';
import { nanoid } from 'nanoid';
import sanitizeHtml from 'sanitize-html';
import { verifyToken } from '@/utils/auth.helper';

// Matches /api/posts
// HTTP methods: GET, POST
// All public routes

export async function GET(req) {
    try {
        const { verified, response } = await verifyToken(req);
        if (!verified) return response;

        const result = await handleGetPosts();

        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: result,
        });
    } catch (error) {
        logger.error(
            {
                url: req.nextUrl,
                method: req.method,
                error: error.stack,
            },
            `[ERROR] ${error.message}`,
        );

        return NextResponse.json({
            error: 'Something went wrong',
            status: 500,
            ok: false,
            data: null,
        });
    }
}

export async function POST(req) {
    try {
        const { token, verified, response } = await verifyToken(req);
        if (!verified) return response;

        const data = await req.formData();
        const image = data.get('image');
        let postInfo = JSON.parse(data.get('postInfo'));

        if (postInfo.description.length > 180)
            throw new Error(`An attempt to create a post with a description that is too long was detected`);

        if (image === 'undefined' || image === 'null') postInfo.image = null;
        else postInfo.image = await handleFileUpload(token.name, token.user_id, image, 'post');

        const post = {
            post_id: nanoid(),
            user_id: postInfo.user_id,
            name: sanitizeHtml(postInfo.name),
            description: sanitizeHtml(postInfo.description),
            image: postInfo.image,
            date_created: new Date(),
        };

        await handleInsertPost(post);

        logger.info(
            {
                url: req.nextUrl,
                method: req.method,
                info: {
                    post_id: post.post_id,
                    posted_by: `${post.name} (id: ${post.user_id})`,
                },
            },
            `[SUCCESS] Post (id: ${post.post_id}) was created`,
        );

        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: null,
        });
    } catch (error) {
        logger.error(
            {
                url: req.nextUrl,
                method: req.method,
                error: error.stack,
            },
            `[ERROR] ${error.message}`,
        );

        return NextResponse.json({
            error: 'Something went wrong',
            status: 500,
            ok: false,
            data: null,
        });
    }
}
