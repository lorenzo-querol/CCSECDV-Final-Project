import { handleGetReports, handleInsertReport } from '@/utils/reports.helper';

import { NextResponse } from 'next/server';
import logger from '@/utils/logger';
import { nanoid } from 'nanoid';
import { verifyToken } from '@/utils/auth.helper';

// Matches /api/reports
// HTTP methods: GET, POST

export async function POST(req) {
    try {
        const { token, verified, response } = await verifyToken(req);
        if (!verified) return response;

        const { user_id, post_id, name, description, status } = await req.json();

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

        logger.info(`Report (id: ${report.report_id}) created by ${token.name} (id: ${token.user_id})`);

        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: null,
        });
    } catch (error) {
        logger.error(`POST /api/reports - ${error.message}`);

        return NextResponse.json({
            error: 'Something went wrong',
            status: 500,
            ok: false,
            data: null,
        });
    }
}

export async function GET(req) {
    try {
        const { verified, response } = await verifyToken(req);
        if (!verified) return response;

        const page = parseInt(req.nextUrl.searchParams.get('page'), 10) || 1; // default to page 1
        const limit = 5;
        const offset = (page - 1) * limit;
        const sortBy = req.nextUrl.searchParams.get('sortby') || 'name';
        const sortOrder = req.nextUrl.searchParams.get('order') || 'ASC';

        const data = await handleGetReports(page, sortBy, sortOrder, limit, offset);

        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: data,
        });
    } catch (error) {
        logger.error(`GET /api/reports - ${error.message}`);

        return NextResponse.json({
            error: 'Something went wrong',
            status: 500,
            ok: false,
            data: null,
        });
    }
}
