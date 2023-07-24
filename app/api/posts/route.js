import { database, s3 } from "@/utils/database";

import { NextResponse } from "next/server";
import { getLogger } from "@/utils/logger";
import { nanoid } from "nanoid";

// Matches /api/posts
// HTTP methods: GET, POST

export async function GET(req) {
	const logger = getLogger();

	try {
		const query =
			"SELECT post_id, date_created, name, description, image, heart_count FROM posts";

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

/**
 * Saves the post to the database and uploads the image to Amazon S3
 * @param {*} post The post object
 * @param {*} image The image file
 */
const savePost = async (post, image) => {
	try {
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

		const bytes = await image.arrayBuffer();
		const buffer = image.from(bytes);

		await s3
			.upload({
				Bucket: process.env.S3_BUCKET_NAME,
				Key: post.image,
				Body: buffer,
				ContentType: image.name.split(".").pop(),
			})
			.promise();
	} catch (error) {
		throw new Error(error.message);
	}
};

// TODO: Under construction
export async function POST(req) {
	const logger = getLogger();
	const data = await req.json();

	try {
		let finalImg = "";
		console.log(data);
		//const postInfo = JSON.parse(data.avatar);
		if (data.avatar != null) {
			const image = data.avatar;
			let imageName = image.split(".");
			imageName[0] = nanoid();
			imageName = imageName.join(".");
			finalImg = "post_" + imageName;
		} else {
			finalImg = "";
		}
		const { user_id, name, description } = data;

		const post = {
			post_id: nanoid(),
			user_id: user_id,
			name: name,
			description: description,
			image: finalImg,
		};

		savePost(post, image);

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
