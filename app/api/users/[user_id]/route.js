import {
    handleDeleteUser,
    handleGetUser,
    handleUpdateUser,
} from "@/utils/users.helper";
import { handleFileDelete, handleFileUpload } from "@/utils/file.helper";
import { sanitizeObject, validateData } from "@/utils/validation.helper";

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getLogger } from "@/utils/logger";
import { verifyToken } from "@/utils/auth.helper";

const logger = getLogger();

// Matches /api/users/[user_id]
// HTTP methods: GET, PUT, DELETE

export async function GET(req, { params }) {
    try {
        const { verified, response } = await verifyToken(req);
        if (!verified) return response;

        const { user_id } = params;

        const result = await handleGetUser(user_id);

        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: result,
        });
    } catch (error) {
        logger.error(error.message);

        return NextResponse.json({
            error: "Something went wrong",
            status: 500,
            ok: false,
            data: null,
        });
    }
}

export async function PUT(req, { params }) {
    try {
        const { verified, response } = await verifyToken(req);
        if (!verified) return response;

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
            throw new Error("Invalid data! Please try again");

        const result = await handleGetUser(user_id);
        const currentInfo = result[0];

        if (avatar !== "undefined") {
            updatedInfo.avatar = await handleFileUpload(avatar, "avatar");
            await handleFileDelete(currentInfo.avatar);
        } else {
            updatedInfo.avatar = currentInfo.avatar;
        }

        if (updatedInfo.password !== currentInfo.password) {
            updatedInfo.password = await bcrypt.hash(updatedInfo.password, 10);
        } else {
            updatedInfo.password = currentInfo.password;
        }

        await handleUpdateUser(user_id, updatedInfo);

        logger.info(`User (id: ${user_id}) updated`);

        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: null,
        });
    } catch (error) {
        logger.error(error.message);

        return NextResponse.json({
            error: "Something went wrong",
            status: 500,
            ok: false,
            data: null,
        });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { verified, response } = await verifyToken(req);
        if (!verified) return response;

        const { user_id } = params;

        await handleDeleteUser(user_id);

        logger.info(`User (id: ${user_id}) deleted`);

        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: null,
        });
    } catch (error) {
        logger.error(error.message);

        return NextResponse.json({
            error: "Something went wrong",
            status: 500,
            ok: false,
            data: null,
        });
    }
}
