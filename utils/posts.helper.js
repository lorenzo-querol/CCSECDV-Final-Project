import { database } from "./database.js";

export const handleInsertPost = async (post) => {
    try {
        await database.connect();
        await database.query(
            `
                INSERT INTO posts (post_id, user_id, name, description, image)
                VALUES (?, ?, ?, ?, ?)
            `,
            [
                post.post_id,
                post.user_id,
                post.name,
                post.description,
                post.image,
            ]
        );
        await database.end();
    } catch (error) {
        throw new Error(
            `[${new Date().toLocaleString()}] handleInsertPost: ${
                error.message
            }`
        );
    }
};

export const handlePostDelete = async (post_id) => {
    try {
        await database.connect();
        await database.query("DELETE FROM posts WHERE post_id = ?", [post_id]);
        await database.query(`DELETE FROM liked_posts WHERE post_id = ?`, [
            post_id,
        ]);
        await database.end();
    } catch (error) {
        throw new Error(
            `[${new Date().toLocaleString()}] handlePostDelete: ${
                error.message
            }`
        );
    }
};

export const handleGetPosts = async () => {
    try {
        await database.connect();
        const result = await database.query(
            `
            SELECT
                posts.user_id,
                posts.post_id,
                posts.date_created,
                posts.name,
                posts.description,
                posts.image,
                posts.heart_count,
                users.avatar
            FROM
                posts
            JOIN
                users ON posts.user_id = users.user_id
            ORDER BY
                posts.date_created DESC
            `
        );
        await database.end();

        return result;
    } catch (error) {
        throw new Error(
            `[${new Date().toLocaleString()}] handleGetPosts: ${error.message}`
        );
    }
};

export const handleGetPost = async (post_id) => {
    try {
        await database.connect();
        const result = await database.query(
            "SELECT *  FROM posts WHERE post_id = ?",
            [post_id]
        );
        await database.end();

        return result;
    } catch (error) {
        throw new Error(
            `[${new Date().toLocaleString()}] handleGetPost: ${error.message}`
        );
    }
};