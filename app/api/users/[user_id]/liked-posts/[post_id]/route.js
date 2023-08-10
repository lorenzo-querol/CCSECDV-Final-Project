import { handleDeleteLikedPost, handleInsertLikedPost } from '@/utils/users.helper';

import { NextResponse } from 'next/server';
import logger from '@/utils/logger';
import { verifyToken } from '@/utils/auth.helper';

// Matches /api/users/[user_id]/liked-posts/[post_id]
// HTTP methods: POST, DELETE

export async function POST(req, { params }) {
    try {
        const { post_id, user_id } = params;

        const { token, verified, response } = await verifyToken(req, user_id);
        if (!verified) return response;

        await handleInsertLikedPost(post_id, user_id);

        logger.info(
            {
                url: req.nextUrl,
                method: req.method,
                info: {
                    post_id: post_id,
                    liked_by: `${token.name} (id: ${token.user_id})`,
                },
            },
            `[SUCCESS] Post (id: ${post_id}) was liked by user`,
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

export async function DELETE(req, { params }) {
    try {
        const { post_id, user_id } = params;

        const { token, verified, response } = await verifyToken(req, user_id);
        if (!verified) return response;

        await handleDeleteLikedPost(post_id, user_id);

        logger.info(
            {
                url: req.nextUrl,
                method: req.method,
                info: {
                    post_id: post_id,
                    unliked_by: `${token.name} (id: ${token.user_id})`,
                },
            },
            `[SUCCESS] Post (id: ${post_id}) was unliked by user`,
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
