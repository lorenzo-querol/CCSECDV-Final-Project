import { handleDeleteUser, handleGetUser, handleUpdateUser } from '@/utils/users.helper';
import { handleFileDelete, handleFileUpload } from '@/utils/file.helper';
import { sanitizeObject, validateData, validateUpdateData } from '@/utils/validation.helper';

import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { handleUpdateAllPosts } from '@/utils/posts.helper';
import logger from '@/utils/logger';
import { verifyToken } from '@/utils/auth.helper';

// Matches /api/users/[user_id]
// HTTP methods: GET, PUT, DELETE

export async function GET(req, { params }) {
    try {
        const { user_id } = params;

        const { verified, response } = await verifyToken(req, user_id);
        if (!verified) return response;

        const result = await handleGetUser(user_id);

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

export async function PUT(req, { params }) {
    try {
        const { user_id } = params;

        const { token, verified, response } = await verifyToken(req, user_id);
        if (!verified) return response;

        const data = await req.formData();
        const avatar = data.get('avatar');
        let updatedInfo = JSON.parse(data.get('updatedInfo'));
        updatedInfo = sanitizeObject(updatedInfo);

        if (
            !validateUpdateData(updatedInfo.firstName, updatedInfo.lastName, updatedInfo.phoneNumber, updatedInfo.email)
        )
            throw new Error(`Invalid data! Please try again`);

        const result = await handleGetUser(user_id);
        const currentInfo = result;

        if (avatar !== 'undefined') {
            updatedInfo.avatar = await handleFileUpload(token.name, token.user_id, avatar, 'avatar');
            await handleFileDelete(currentInfo.avatar);
        } else {
            updatedInfo.avatar = currentInfo.avatar;
        }

        if (updatedInfo.password !== currentInfo.password) {
            updatedInfo.password = await bcrypt.hash(updatedInfo.password, 10);
        } else {
            updatedInfo.password = currentInfo.password;
        }

        updatedInfo.email = currentInfo.email;

        await handleUpdateUser(user_id, updatedInfo);
        await handleUpdateAllPosts(`${updatedInfo.firstName} ${updatedInfo.lastName}`, user_id);

        logger.info(
            {
                url: req.nextUrl,
                method: req.method,
                info: {
                    user: updatedInfo,
                },
            },
            `[SUCCESS] User (id: ${user_id}) updated details`,
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
        const { user_id } = params;

        const { token, verified, response } = await verifyToken(req, user_id);
        if (!verified) return response;

        await handleDeleteUser(user_id);

        logger.info(
            {
                url: req.nextUrl,
                method: req.method,
                info: {
                    user_id: user_id,
                    deleted_by: token.user_id,
                },
            },
            `[SUCCESS] User (id: ${user_id}) deleted`,
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
