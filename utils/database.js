import AWS from "aws-sdk";
import mysql from "serverless-mysql";

export const database = mysql({
	config: {
		host: process.env.PLANETSCALE_HOST,
		user: process.env.PLANETSCALE_USER,
		password: process.env.PLANETSCALE_PASSWORD,
		database: process.env.PLANETSCALE_NAME,
		ssl: {
			rejectUnauthorized: true,
		},
	},
});

export const s3 = new AWS.S3({
	accessKeyId: process.env.S3_ACCESS_KEY,
	secretAccessKey: process.env.S3_SECRET_KEY,
	region: process.env.S3_REGION,
});
