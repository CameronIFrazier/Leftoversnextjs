import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

async function getConnection() {
    return mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: Number(process.env.MYSQL_PORT || 3306),
    });
}

async function getUserIdByEmail(connection: any, email: string) {
    const [rows] = await connection.execute(
        `SELECT id FROM users WHERE email = ? LIMIT 1`,
        [email]
    );
    if (!Array.isArray(rows) || rows.length === 0) {
        return null;
    }
    return (rows as any)[0].id;
}

export async function POST(req: Request) {
    try {
        const { followerEmail, followingId } = await req.json();

        if (!followerEmail || !followingId) {
            return NextResponse.json({ success: false, error: "Missing email or followingId" });
        }

        const connection = await getConnection();
        const followerId = await getUserIdByEmail(connection, followerEmail);

        if (!followerId) {
            await connection.end();
            return NextResponse.json({ success: false, error: "Follower not found" });
        }

        await connection.execute(
            `INSERT INTO follows (follower_id, following_id) VALUES (?, ?)`,
            [followerId, followingId]
        );

        await connection.end();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error following user:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" });
    }
}

export async function DELETE(req: Request) {
    try {
        const { followerEmail, followingId } = await req.json();

        if (!followerEmail || !followingId) {
            return NextResponse.json({ success: false, error: "Missing email or followingId" });
        }

        const connection = await getConnection();
        const followerId = await getUserIdByEmail(connection, followerEmail);

        if (!followerId) {
            await connection.end();
            return NextResponse.json({ success: false, error: "Follower not found" });
        }

        await connection.execute(
            `DELETE FROM follows WHERE follower_id = ? AND following_id = ?`,
            [followerId, followingId]
        );

        await connection.end();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error unfollowing user:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" });
    }
}
