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
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });

        const [rows] = await connection.execute(
            "SELECT id, username, email FROM users WHERE username LIKE ? LIMIT 20",
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
