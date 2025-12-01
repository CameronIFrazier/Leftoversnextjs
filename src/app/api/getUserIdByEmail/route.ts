import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");
        if (!email) {
            return NextResponse.json({ success: false, error: "Missing email" }, { status: 400 });
        }

        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: Number(process.env.MYSQL_PORT || 3306),
        });

        const [rows] = await connection.execute(
            `SELECT id FROM users WHERE email = ? LIMIT 1`,
            [email]
        );
        await connection.end();

        if (!Array.isArray(rows) || rows.length === 0) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, id: (rows as any)[0].id });
    } catch (err) {
        console.error("Error resolving userId:", err);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
