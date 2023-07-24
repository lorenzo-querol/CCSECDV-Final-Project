import { NextResponse } from "next/server";
import { database } from "@/utils/database";
import { getLogger } from "@/utils/logger";
import { nanoid } from "nanoid";

// Matches /api/reports
// HTTP methods: GET, POST

export async function POST(req) {
	const logger = getLogger();

	try {
		const { user_id, name, description, status, action } = await req.json();

		const report = {
			report_id: nanoid(),
			user_id: user_id,
			name: name,
			description: description,
			status: status,
			action: action,
		};

		const query =
			"INSERT INTO reports (report_id, user_id, name, description, status) VALUES (?, ?, ?, ?, ?)";

		await database.connect();
		await database.query(query, [
			report.report_id,
			report.user_id,
			report.name,
			report.description,
			report.status,
		]);
		await database.end();

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

export async function GET(req) {
	const logger = getLogger();

	try {
		const page = parseInt(req.nextUrl.searchParams.get("page"), 10) || 1; // default to page 1
		const limit = 5;
		const offset = (page - 1) * limit;
		const sortBy = req.nextUrl.searchParams.get("sortby") || "name";
		const sortOrder = req.nextUrl.searchParams.get("order") || "ASC";

		const query = `SELECT report_id, date_created, name, description, status, duration, cooldown_until FROM reports ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
		const totalCountQuery = "SELECT COUNT(*) AS count FROM reports";

		await database.connect();
		const result = await database.query(query, [limit, offset]);
		const totalReports = await database.query(totalCountQuery);
		await database.end();

		const totalPages = Math.ceil(totalReports[0].count / limit);

		return NextResponse.json({
			error: null,
			status: 200,
			ok: true,
			data: {
				page,
				totalPages,
				totalReports: totalReports[0].count,
				limit,
				reports: result,
			},
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
