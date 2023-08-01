import { database } from "./database";

export const handleInsertUser = async (user) => {
    try {
        await database.connect();
        await database.query(
            `
            INSERT INTO users (user_id, email, first_name, last_name, password, phone_num, avatar)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                user.user_id,
                user.email,
                user.firstName,
                user.lastName,
                user.password,
                user.phoneNumber,
                user.avatar,
            ]
        );

        await database.end();
    } catch (error) {
        throw new Error(
            `[${new Date().toLocaleString()}] handleInsertUser: ${
                error.message
            }`
        );
    }
};

export const handleGetUser = async (user_id) => {
    try {
        await database.connect();
        const result = await database.query(
            `
            SELECT email, first_name, last_name, password, phone_num, avatar
            FROM users WHERE user_id = ?
            `,
            [user_id]
        );
        await database.end();

        return result[0];
    } catch (error) {
        throw new Error(
            `[${new Date().toLocaleString()}] handleGetUser: ${error.message}`
        );
    }
};

export const handleGetUsers = async (
    page,
    sortBy,
    sortOrder,
    limit,
    offset
) => {
    try {
        await database.connect();
        const result = await database.query(
            `
            SELECT user_id, email, CONCAT(first_name,' ',last_name) AS name
            FROM users
            ORDER BY ${sortBy} ${sortOrder} 
            LIMIT ? OFFSET ?
            `,
            [limit, offset]
        );
        const totalUsers = await database.query(
            "SELECT COUNT(*) AS count FROM users"
        );
        await database.end();

        const totalPages = Math.ceil(totalUsers[0].count / limit);

        const users = result.map((user) => ({
            id: user.user_id,
            email: user.email,
            name: user.name,
        }));

        return {
            page,
            totalPages,
            totalUsers: totalUsers[0].count,
            limit,
            users: users,
        };
    } catch (error) {
        throw new Error(
            `[${new Date().toLocaleString()}] handleGetUsers: ${error.message}`
        );
    }
};

export const handleDeleteUser = async (user_id) => {
    try {
        await database.connect();

        await database.query("DELETE FROM users WHERE user_id = ?", [user_id]);
        await database.query("DELETE FROM posts WHERE user_id = ?", [user_id]);
        await database.query("DELETE FROM liked_posts WHERE user_id = ?", [
            user_id,
        ]);
        await database.query("DELETE FROM reports WHERE user_id = ?", [
            user_id,
        ]);

        await database.end();
    } catch (error) {
        throw new Error(
            `[${new Date().toLocaleString()}] handleDeleteUser: ${
                error.message
            }`
        );
    }
};

export const handleUpdateUser = async (user_id, updatedInfo) => {
    try {
        await database.connect();
        await database.query(
            `
            UPDATE users SET first_name = ?, last_name = ?, phone_num = ?, email = ?, password = ?, avatar = ?
            WHERE user_id = ?
            `,
            [
                updatedInfo.firstName,
                updatedInfo.lastName,
                updatedInfo.phoneNumber,
                updatedInfo.email,
                updatedInfo.password,
                updatedInfo.avatar,
                user_id,
            ]
        );

        await database.end();
    } catch (error) {
        throw new Error(
            `[${new Date().toLocaleString()}] handleUpdateUser: ${
                error.message
            }`
        );
    }
};

export const handleGetLikedPosts = async (user_id) => {
    try {
        await database.connect();
        const result = await database.query(
            `
            SELECT
                p.user_id,
                p.post_id, 
                p.date_created, 
                p.name, 
                p.description, 
                p.image, 
                p.heart_count,
                u.avatar
            FROM 
                posts p
            JOIN 
                liked_posts lp ON p.post_id = lp.post_id
            JOIN 
                users u ON p.user_id = u.user_id
            WHERE 
                lp.user_id = ?
			ORDER BY
				p.date_created DESC
            `,
            [user_id]
        );

        await database.end();

        return result;
    } catch (error) {
        throw new Error(
            `[${new Date().toLocaleString()}] handleGetMyPosts: ${
                error.message
            }`
        );
    }
};

export const handleInsertLikedPost = async (post_id, user_id) => {
    try {
        await database.connect();
        await database.query(
            `
            INSERT INTO liked_posts (post_id, user_id)
            VALUES (?, ?);
            `,
            [post_id, user_id]
        );
        await database.end();
    } catch (error) {
        throw new Error(
            `[${new Date().toLocaleString()}] handleInsertLikedPost: ${
                error.message
            }`
        );
    }
};

export const handleDeleteLikedPost = async (post_id, user_id) => {
    try {
        await database.connect();
        await database.query(
            `
            DELETE FROM liked_posts
            WHERE post_id = ? AND user_id = ?
            `,
            [post_id, user_id]
        );
        await database.end();
    } catch (error) {
        throw new Error(
            `[${new Date().toLocaleString()}] handleDeleteLikedPost: ${
                error.message
            }`
        );
    }
};
