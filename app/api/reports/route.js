import { handleGetReports, handleInsertReport } from "@/utils/reports.helper";

import { NextResponse } from "next/server";
import { getLogger } from "@/utils/logger";
import { nanoid } from "nanoid";

// Matches /api/reports
// HTTP methods: GET, POST

export async function POST(req) {
    const logger = getLogger();

    try {
        const { user_id, name, post_id, description, status } = await req.json();

        const report = {
            report_id: nanoid(),
            user_id: user_id,
            post_id: post_id,
            name: name,
            description: description,
            status: status,
            date_created: new Date(),
        };

        await handleInsertReport(report);

        logger.info(
            `[${new Date().toLocaleString()}] Report created: ${
                report.report_id
            }`
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

export async function GET(req) {
    const logger = getLogger();

    try {
        const page = parseInt(req.nextUrl.searchParams.get("page"), 10) || 1; // default to page 1
        const limit = 5;
        const offset = (page - 1) * limit;
        const sortBy = req.nextUrl.searchParams.get("sortby") || "name";
        const sortOrder = req.nextUrl.searchParams.get("order") || "ASC";

        const data = await handleGetReports(
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
