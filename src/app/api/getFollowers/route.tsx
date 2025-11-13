import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";

interface Follower extends RowDataPacket {
    id: number;
    firstname: string;
    lastname: string;
    userName: string;
    profile_pic: string | null;
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ success: false, error: "Missing userId" });
        }

        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: Number(process.env.MYSQL_PORT || 3306),
        });

        const [rows] = await connection.execute<Follower[]>(
            `
      SELECT users.id, users.firstname, users.lastname, users.userName, users.profile_pic
      FROM followers
      JOIN users ON followers.follower_id = users.id
      WHERE followers.followed_id = ?
      `,
            [userId]
        );

        await connection.end();

        return NextResponse.json({ success: true, followers: rows });
    } catch (error) {
        console.error("Error fetching followers:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" });
    }
}
