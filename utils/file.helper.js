import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

import { ACCEPTABLE_FILE_TYPES } from '@/constants';
import { Buffer } from 'buffer';
import { fileTypeFromBuffer } from 'file-type';
import { nanoid } from 'nanoid';
import { s3 } from '@/utils/database';

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

export const handleFileUpload = async (name, user_id, image, type) => {
    if (!image) return null;

    try {
        let imageName = image.name.split('.');
        imageName[0] = nanoid();
        imageName = imageName.join('.');
        const imageNameWithPrefix = `${type}_${imageName}`;

        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const metaData = await fileTypeFromBuffer(buffer);

        if (!ACCEPTABLE_FILE_TYPES.includes(metaData.mime)) {
            if (!user_id)
                throw new Error(`Invalid file type was attempted to be uploaded by ${name} during registration`);
            throw new Error(`Invalid file type was attempted to be uploaded by ${name} (id: ${user_id})`);
        }

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: imageNameWithPrefix,
            Body: buffer,
            ContentType: metaData.mime,
            ACL: 'public-read',
        });

        await s3.send(command);

        return imageNameWithPrefix;
    } catch (error) {
        throw new Error(`handleFileUpload - ${error.message}`);
    }
};

export const handleFileDelete = async image => {
    if (!image) return null;

    try {
        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: image,
        });

        await s3.send(command);
    } catch (error) {
        throw new Error(`handleFileDelete - ${error.message}`);
    }
};
