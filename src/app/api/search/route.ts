import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query");

        if (!query || query.trim() === "") {
            return NextResponse.json([], { status: 200 });
        }

        // Connect to database
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: Number(process.env.MYSQL_PORT || 3306),
        });

        const [rows] = await connection.execute(
            "SELECT id, username, email, profile_pic as avatar FROM users WHERE username LIKE ? LIMIT 20",
            [`%${query}%`]
        );

        await connection.end();

        return NextResponse.json(rows);
    } catch (err: any) {
        console.error("Error in /api/search:", err);
        return NextResponse.json(
            { error: "Internal Server Error", message: err.message || "" },
            { status: 500 }
        );
    }
}
