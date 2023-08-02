import {
    handleGetPost,
    handlePostDelete,
    handleUpdatePost,
} from "@/utils/posts.helper";

import { NextResponse } from "next/server";
import { getLogger } from "@/utils/logger";
import { handleFileDelete } from "@/utils/file.helper";

var assert = require("assert");

const logger = getLogger();

export async function GET(req, {params}) {
    try {
        const { post_id } = params;
        const result = await handleGetPost(post_id);

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
export async function PUT(req, { params }) {
    try {
        const { post_id } = params;
        const { heart_count } = await req.json();

        // NOTE heart_count can only be 1 or -1, else throw invalid error
        const heart_count_int = parseInt(heart_count, 10);
        assert(
            heart_count_int === 1 || heart_count_int === -1,
            "Invalid heart count."
        );

        await handleUpdatePost(post_id, heart_count_int);

        logger.info(
            `[${new Date().toLocaleString()}] Post (id: ${post_id}) updated.`
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

        const result = await handleGetPost(post_id);
        await handlePostDelete(post_id);
        await handleFileDelete(result[0].image);

        logger.info(
            `[${new Date().toLocaleString()}] Post (id: ${post_id}) deleted.`
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
