import {
	handleDeleteReport,
	handleGetReport,
	handleUpdateReport,
	parseDuration,
} from "@/utils/reports.helper";

import { NextResponse } from "next/server";
import { getLogger } from "@/utils/logger";

const logger = getLogger();

// Matches /api/reports/[report_id]
// HTTP methods: GET, DELETE, PATCH

export async function GET(req, { params }) {
	try {
		const { report_id } = params;

		await handleGetReport(report_id);

		return NextResponse.json({
			error: null,
			status: 200,
			ok: true,
			data: result[0],
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
		const { report_id } = params;

		await handleDeleteReport(report_id);

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

export async function PUT(req, { params }) {
	try {
		const { report_id } = params;
		const { status, duration } = await req.json();
		const cooldownUntil = parseDuration(duration);

		await handleUpdateReport(report_id, status, duration, cooldownUntil);

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
