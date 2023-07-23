import { Buffer } from "buffer";
import { NextResponse } from "next/server";
import { database } from "@/utils/database";
import { getLogger } from "@/utils/logger";
import { nanoid } from "nanoid";
import { writeFile } from "fs/promises";

// Matches /api/posts
// HTTP methods: GET, POST
export async function GET(req) {
	const logger = getLogger();
	try {
		const query =
			"SELECT date_created, name, description, image, heart_count FROM posts";

		await database.connect();
		const result = await database.query(query);
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
			data: {
				result,
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

// TODO: Under construction
export async function POST(req) {

	const logger = getLogger();
	const data = await req.json()

	try {
		
		console.log(data)
		//const postInfo = JSON.parse(data.avatar);

		const image = data.avatar;
		let imageName = image.split(".");
		imageName[0] = nanoid();
		imageName = imageName.join(".");

		const { user_id, name, description } = postInfo;

		const post = {
			post_id: nanoid(),
			user_id: user_id,
			name: name,
			description: description,
			image: "posts/post_" + imageName,
		};

		const query =
			"INSERT INTO posts (post_id, user_id, name, description, image) VALUES (?, ?, ?, ?, ?)";

		await database.connect();
		await database.query(query, [
			post.post_id,
			post.user_id,
			post.name,
			post.description,
			post.image,
		]);
		await database.end();

		const bytes = await avatar.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const path = `${process.cwd()}/${user.post}`;

		await writeFile(path, buffer);

		logger.info(
			`User ${post.name} (id: ${post.user_id}) created a post with id ${post.post_id}.`,
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
			error: "internal",
			status: 500,
			ok: false,
			data: null,
		});
	}
}
