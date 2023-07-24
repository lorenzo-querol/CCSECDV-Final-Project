export async function GET(req, { params }) {
	const logger = getLogger();

	try {
		const { report_id } = params;
		const query = "SELECT start_time, end_time FROM reports where user_id = ?";

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

		// Check if the user is in cooldown
		const now = new Date();

		return NextResponse.json({
			error: null,
			status: 200,
			ok: true,
			data: result,
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
