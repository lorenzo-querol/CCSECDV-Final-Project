import { database } from "@/utils/database";

export const parseDuration = (duration) => {
	const [value, unit] = duration.split("_");
	const now = new Date();
	let offset = 0;

	switch (unit) {
		case "d":
			offset = value * 24 * 60 * 60 * 1000;
			break;
		case "h":
			offset = value * 60 * 60 * 1000;
			break;
		case "m":
			offset = value * 60 * 1000;
			break;
	}

	return new Date(now.getTime() + offset);
};

export const handleInsertReport = async (report) => {
	try {
		await database.connect();
		await database.query(
			`
			INSERT INTO reports (report_id, user_id, post_id, name, description, status, date_created) 
			VALUES (?, ?, ?, ?, ?, ?, ?)
			`,
			[
				report.report_id,
				report.user_id,
				report.post_id,
				report.name,
				report.description,
				report.status,
				report.date_created,
			],
		);
		await database.end();
	} catch (error) {
		throw new Error(`handleInsertReport - ${error.message}`);
	}
};

export const handleUpdateReport = async (
	report_id,
	status,
	duration,
	cooldownUntil,
) => {
	try {
		await database.connect();

		await database
			.transaction()
			.query(
				`
                UPDATE reports SET status = ?, duration = ?, cooldown_until = ? 
                WHERE report_id = ?
                `,
				[status, duration, cooldownUntil, report_id],
			)
			.query(
				`
                SELECT user_id FROM reports 
                WHERE report_id = ?
                `,
				[report_id],
			)
			.query((result) => {
				return [
					`
                    UPDATE users SET cooldown_until = ? 
                    WHERE user_id = ?
                    `,
					[cooldownUntil, result[0].user_id],
				];
			})
			.rollback((error) => {
				throw new Error(error);
			})
			.commit();

		await database.end();
	} catch (error) {
		throw new Error(`handleUpdateReport - ${error.message}`);
	}
};

export const handleDeleteReport = async (report_id) => {
	try {
		await database.connect();
		await database
			.transaction()
			.query("DELETE FROM reports WHERE report_id = ?", [report_id])
			.query(
				`
                SELECT user_id FROM reports
                WHERE report_id = ?
                `,
				[report_id],
			)
			.query((result) => {
				return [
					`
                    UPDATE users SET cooldown_until = NULL
                    WHERE user_id = ?
                    `,
					[result[0].user_id],
				];
			})
			.rollback((error) => {
				throw new Error(error);
			})
			.commit();
		await database.end();
	} catch (error) {
		throw new Error(`handleDeleteReport - ${error.message}`);
	}
};

export const handleGetReport = async (report_id) => {
	try {
		await database.connect();
		const result = await database.query(
			`
			SELECT report_id, post_id, date_created, name, description, status, duration, cooldown_until 
			FROM reports WHERE report_id = ?
			`,
			[report_id],
		);
		await database.end();

		return result;
	} catch (error) {
		throw new Error(`handleGetReport - ${error.message}`);
	}
};

export const handleGetReports = async (
	page,
	sortBy,
	sortOrder,
	limit,
	offset,
) => {
	let reports, totalReports;
	const currentTime = new Date();

	try {
		await database.connect();
		await database
			.transaction()
			.query(
				` 
                UPDATE reports  
                SET status = 'completed'
                WHERE cooldown_until < ? AND status = 'approved'
                `,
				[currentTime], // Update the status of reports whose cooldown_until has passed and status is "approved"
			)
			.query(
				`
                SELECT report_id, post_id, date_created, name, description, status, duration, cooldown_until 
                FROM reports 
                ORDER BY ${sortBy} ${sortOrder} 
                LIMIT ? OFFSET ?
                `,
				[limit, offset],
			)
			.query((result) => {
				reports = result;
				return [`SELECT COUNT(*) AS count FROM reports`];
			})
			.query((result) => {
				totalReports = result[0];
			})
			.rollback((error) => {
				throw new Error(error);
			})
			.commit();
		await database.end();

		const totalPages = Math.ceil(totalReports.count / limit);

		return {
			page,
			totalPages,
			totalReports: totalReports.count,
			limit,
			reports: reports,
		};
	} catch (error) {
		throw new Error(`handleGetReports - ${error.message}`);
	}
};
