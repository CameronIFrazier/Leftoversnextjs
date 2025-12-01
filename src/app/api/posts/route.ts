import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, userName, mediaUrl } = body;

    if (!title || !userName) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Connect to MySQL (Railway)
    const db = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    const [result] = await db.execute(
      `INSERT INTO posts (title, description, username, media_url) VALUES (?, ?, ?, ?)`,
      [title, description || "", userName, mediaUrl || null]
    );

    await db.end();

    return NextResponse.json({ success: true, postId: (result as any).insertId });
  } catch (err: any) {
    console.error("DB Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows] = await db.query("SELECT * FROM posts ORDER BY created_at DESC");
    await db.end();

    return NextResponse.json({ success: true, posts: rows });
  } catch (err: any) {
    console.error("DB Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
