import { checkPassword, validateData } from "@/utils/validation.helper";

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getLogger } from "@/utils/logger";
import { handleFileUpload } from "@/utils/file.helper";
import { handleInsertUser } from "@/utils/users.helper";
import { nanoid } from "nanoid";
import sanitizeHtml from "sanitize-html";

export async function POST(req) {
    const logger = getLogger();

    try {
        const data = await req.formData();
        let userInfo = JSON.parse(data.get("userInfo"));
        const avatar = data.get("avatar");

        if (!validateData(firstName, lastName, phoneNumber, email))
            throw new Error("Invalid data provided.");

        if (!checkPassword(userInfo.password, userInfo.confirmPassword)) {
            throw new Error("Passwords do not match. Please try again.");
        }

        userInfo.avatar = await handleFileUpload(avatar, "avatar");
        userInfo.hashedPassword = await bcrypt.hash(userInfo.password, 10);
        delete userInfo.confirmPassword;

        const user = {
            user_id: nanoid(),
            email: sanitizeHtml(userInfo.email.trim()),
            firstName: sanitizeHtml(userInfo.firstName.trim()),
            lastName: sanitizeHtml(userInfo.lastName.trim()),
            password: userInfo.hashedPassword,
            phoneNumber: sanitizeHtml(userInfo.phoneNumber.trim()),
            avatar: userInfo.avatar,
        };

        await handleInsertUser(user);

        logger.info(
            `[${new Date().toLocaleString()}] User (id: ${
                user.user_id
            }) registered.`
        );

        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: null,
        });
    } catch (error) {
        logger.error(error.message);

        if (error.message.includes("ER_DUP_ENTRY")) {
            return NextResponse.json({
                error: "Email already exists. Please try again.",
                status: 400,
                ok: false,
                data: null,
            });
        }

        if (error.message.includes("ER_DATA_TOO_LONG")) {
            return NextResponse.json({
                error: "Data too long. Please try again.",
                status: 400,
                ok: false,
                data: null,
            });
        }

        return NextResponse.json({
            error: "Something went wrong.",
            status: 500,
            ok: false,
            data: null,
        });
    }
}

export async function GET(req) {
    const logger = getLogger();

    try {
        const page = parseInt(req.nextUrl.searchParams.get("page"), 10) || 1;
        const sortBy = req.nextUrl.searchParams.get("sortby") || "name";
        const sortOrder = req.nextUrl.searchParams.get("order") || "ASC";
        const limit = 5;
        const offset = (page - 1) * limit;

        const data = await handleGetUsers(
            page,
            sortBy,
            sortOrder,
            limit,
            offset
        );

        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: data,
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
