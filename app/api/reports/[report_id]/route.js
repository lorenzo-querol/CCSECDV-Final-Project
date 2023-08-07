import { handleDeleteReport, handleGetReport, handleUpdateReport, parseDuration } from '@/utils/reports.helper';

import { NextResponse } from 'next/server';
import { getLogger } from '@/utils/logger';
import { verifyToken } from '@/utils/auth.helper';

const logger = getLogger();

// Matches /api/reports/[report_id]
// HTTP methods: GET, DELETE, PUT

export async function GET(req, { params }) {
    try {
        const { verified, response } = await verifyToken(req);
        if (!verified) return response;

        const { report_id } = params;

        await handleGetReport(report_id);

        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: result[0],
        });
    } catch (error) {
        logger.error(`GET /api/reports/[report_id] - ${error.message}`);

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
        const { token, verified, response } = await verifyToken(req);
        if (!verified) return response;

        const { report_id } = params;

        await handleDeleteReport(report_id);

        logger.info(`Report (id: ${report_id}) deleted by ${token.name} (id: ${token.user_id})`);

        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: null,
        });
    } catch (error) {
        logger.error(`DELETE /api/reports/[report_id] - ${error.message}`);

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
        const { token, verified, response } = await verifyToken(req);
        if (!verified) return response;

        const { report_id } = params;
        const { status, duration } = await req.json();
        const cooldownUntil = duration !== null ? parseDuration(duration) : null;

        await handleUpdateReport(report_id, status, duration, cooldownUntil);

        logger.info(`Report (id: ${report_id}) updated by ${token.name} (id: ${token.user_id})`);

        return NextResponse.json({
            error: null,
            status: 200,
            ok: true,
            data: null,
        });
    } catch (error) {
        logger.error(`PUT /api/reports/[report_id] - ${error.message}`);

        return NextResponse.json({
            error: 'Something went wrong',
            status: 500,
            ok: false,
            data: null,
        });
    }
}
