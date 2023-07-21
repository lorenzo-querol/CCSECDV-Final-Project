import { getLogger } from '@/utils/logger';
import { database } from '@/utils/database';

// Matches /api/posts
// HTTP methods: GET, POST

// TODO: Under construction
export async function GET(req) {
	const logger = getLogger();

	try {
		const page = parseInt(req.nextUrl.searchParams.get('page'), 10) || 1;
		const limit = 5;
		const offset = (page - 1) * limit;

		const query = 'SELECT * FROM posts LIMIT ? OFFSET ?';
		const totalCountQuery = 'SELECT COUNT(*) AS count FROM posts';

		await database.connect();
		const result = await database.query(query, [limit, offset]);
		const totalPosts = await database.query(totalCountQuery);
		await database.end();

		const totalPages = Math.ceil(totalPosts[0].count / limit);

		const posts = result.map((post) => ({
			id: post.post_id,
			title: post.title,
			content: post.content,
		}));

		return NextResponse.json({
			error: null,
			status: 200,
			ok: true,
			data: {
				page,
				totalPages,
				totalPosts,
				limit,
				posts: posts,
			},
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

// TODO: Under construction
export async function POST(req) {
	const logger = getLogger();

	try {
		const { title, content } = await req.body.json();

		const query = 'INSERT INTO posts (title, content) VALUES (?, ?)';

		await database.connect();
		const result = await database.query(query, [title, content]);
		await database.end();

		return NextResponse.json({
			error: null,
			status: 200,
			ok: true,
			data: {
				id: result.insertId,
				title,
				content,
			},
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
