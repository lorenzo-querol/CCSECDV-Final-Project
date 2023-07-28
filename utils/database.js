import { S3Client } from "@aws-sdk/client-s3";
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

const credentials = {
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
};

export const s3 = new S3Client(credentials);
