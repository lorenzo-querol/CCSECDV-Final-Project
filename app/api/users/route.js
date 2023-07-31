import { checkPassword, validateData } from "@/utils/validation.helper";
import { database, s3 } from "@/utils/database";

import { Buffer } from "buffer";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import bcrypt from "bcrypt";
import { fileTypeFromBuffer } from "file-type";
import { getLogger } from "@/utils/logger";
import { nanoid } from "nanoid";
import sanitizeHtml from "sanitize-html";

/**
 * Save the user to the database and the avatar to the file system
 * @param {*} user The user object
 * @param {*} avatar A string containing the avatar path
 */
async function saveUser(user, avatar) {
	try {
		const query =
			"INSERT INTO users (user_id, email, first_name, last_name, password, phone_num, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)";

		await database.connect();
		await database.query(query, [
			user.user_id,
			user.email,
			user.firstName,
			user.lastName,
			user.password,
			user.phoneNumber,
			user.avatar,
		]);
		await database.end();

		const bytes = await avatar.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const mimeType = await fileTypeFromBuffer(buffer);

		const command = new PutObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: user.avatar,
			Body: buffer,
			ContentType: mimeType.mime,
			ACL: "public-read",
		});

		await s3.send(command);
	} catch (error) {
		throw new Error(error.message);
	}
}

export async function POST(req) {
	const logger = getLogger();

	try {
		const data = await req.formData();
		const userInfo = JSON.parse(data.get("userInfo"));

		let avatar = data.get("avatar");
		let avatarName = avatar.name.split(".");
		avatarName[0] = nanoid();
		avatarName = avatarName.join(".");

		const {
			email,
			firstName,
			lastName,
			password,
			phoneNumber,
			confirmPassword,
		} = userInfo;

		if (!checkPassword(password, confirmPassword)) {
			logger.error("Passwords do not match");
			return NextResponse.json({
				error: "invalid",
				status: 400,
				ok: true,
				data: null,
			});
		}

		if (!validateData(firstName, lastName, phoneNumber, email)) {
			logger.error("Invalid data");
			return NextResponse.json({
				error: "invalid",
				status: 400,
				ok: true,
				data: null,
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = {
			user_id: nanoid(),
			email: sanitizeHtml(email.trim()),
			firstName: sanitizeHtml(firstName.trim()),
			lastName: sanitizeHtml(lastName.trim()),
			password: hashedPassword,
			phoneNumber: sanitizeHtml(phoneNumber.trim()),
			avatar: "avatar_" + avatarName,
		};

		await saveUser(user, avatar);

		logger.info(`User ${user.email} (id: ${user.user_id}) created.`);
		return NextResponse.json({
			error: null,
			status: 201,
			ok: true,
			data: null,
		});
	} catch (error) {
		logger.error(error.message);
		if (error.message.includes("ER_DUP_ENTRY")) {
			return NextResponse.json({
				error: "duplicate",
				status: 400,
				ok: false,
				data: null,
				message: "Email already exists.",
			});
		}

		if (error.message.includes("ER_DATA_TOO_LONG")) {
			return NextResponse.json({
				error: "long_data",
				status: 400,
				ok: false,
				data: null,
				message: "Data too long. Please register again.",
			});
		}

		return NextResponse.json({
			error: "internal",
			status: 500,
			ok: false,
			data: null,
			message: "Internal server error. Please try again later.",
		});
	}
}

export async function GET(req) {
	const logger = getLogger();

	try {
		const page = parseInt(req.nextUrl.searchParams.get("page"), 10) || 1; // default to page 1
		const sortBy = req.nextUrl.searchParams.get("sortby") || "name";
		const sortOrder = req.nextUrl.searchParams.get("order") || "ASC";

		const limit = 5;
		const offset = (page - 1) * limit;

		const query = `SELECT email, CONCAT(first_name,' ',last_name) AS name FROM users ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
		const totalCountQuery = "SELECT COUNT(*) AS count FROM users";

		await database.connect();
		const result = await database.query(query, [limit, offset]);
		const totalUsers = await database.query(totalCountQuery);
		await database.end();

		const totalPages = Math.ceil(totalUsers[0].count / limit);

		const users = result.map((user) => ({
			id: user.user_id,
			email: user.email,
			name: user.name,
		}));

		return NextResponse.json({
			error: null,
			status: 200,
			ok: true,
			data: {
				page,
				totalPages,
				totalUsers: totalUsers[0].count,
				limit,
				users: users,
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
