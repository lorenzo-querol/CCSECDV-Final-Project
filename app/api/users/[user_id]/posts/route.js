import { getLogger } from '@/utils/logger';
import { database } from '@/utils/database';

// Matches /api/users/[user_id]/posts
// HTTP methods: GET

// TODO: Under construction
export async function GET(req, { params }) {
	const logger = getLogger();

	try {
		const { user_id } = params;
		const query = 'SELECT date_created, name, description, image, heart_count FROM posts where user_id = ?';

		await database.connect();
		const result = await database.query(query, [user_id]);
		await database.end();

		if (result.length === 0)
			return NextResponse.json({
				error: 'notfound',
				status: 400,
				ok: false,
				data: null,
			});

		return NextResponse.json({
			error: null,
			status: 200,
			ok: true,
			data: result,
		});
	} catch (error) {
		logger.error(error.message);
		return NextResponse.json({
			error: 'internal',
			status: 500,
			ok: false,
			data: null,
		});
	}
}