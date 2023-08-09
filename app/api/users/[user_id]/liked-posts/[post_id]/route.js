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

        logger.info(`Post (id: ${post_id}) liked by ${token.name} (id: ${token.user_id})`);

        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: null,
        });
    } catch (error) {
        logger.error(`POST /api/users/[user_id]/liked-posts - ${error.message}`);

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

        logger.info(`Post (id: ${post_id}) unliked by ${token.name} (id: ${token.user_id})`);

        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: null,
        });
    } catch (error) {
        logger.error(`DELETE /api/users/[user_id]/liked-posts/[post_id] - ${error.message}`);

        return NextResponse.json({
            error: 'Something went wrong',
            status: 500,
            ok: false,
            data: null,
        });
    }
}
