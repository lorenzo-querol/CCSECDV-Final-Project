import { NextResponse } from "next/server";
import { database } from "@/utils/database";
import { getLogger } from "@/utils/logger";
import { parseDuration } from "@/utils/report.helper";

// Matches /api/reports/[report_id]
// HTTP methods: GET, DELETE, PATCH

export async function GET(req, { params }) {
	const logger = getLogger();

	try {
		const { report_id } = params;

		const query =
			"SELECT report_id, date_created, name, description, status, duration, cooldown_until FROM reports where report_id = ?";

		await database.connect();
		const result = await database.query(query, [report_id]);
		await database.end();

		if (result.length === 0)
			return NextResponse.json({
				error: "notfound",
				status: 404,
				ok: false,
				data: null,
			});

		return NextResponse.json({
			error: null,
			status: 200,
			ok: true,
			data: result[0],
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

export async function DELETE(req, { params }) {
	const logger = getLogger();

	try {
		const { report_id } = params;
		const query = "DELETE FROM reports WHERE report_id = ?";

		await database.connect();
		const result = await database.query(query, [report_id]);
		await database.end();

		if (result.affectedRows === 0)
			return NextResponse.json({
				error: "notfound",
				status: 404,
				ok: false,
				data: null,
			});

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

export async function PATCH(req, { params }) {
	const logger = getLogger();

	try {
		const { report_id } = params;
		const { status, duration } = await req.json();

		const coolDown = parseDuration(duration);

		const query =
			"UPDATE reports SET status = ?, duration = ?, cooldown_until = ? WHERE report_id = ?";

		await database.connect();
		const result = await database.query(query, [
			status,
			duration,
			coolDown,
			report_id,
		]);
		await database.end();

		if (result.affectedRows === 0)
			return NextResponse.json({
				error: "notfound",
				status: 404,
				ok: false,
				data: null,
			});

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
