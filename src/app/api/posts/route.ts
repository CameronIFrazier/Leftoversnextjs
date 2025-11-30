import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, userName, mediaUrl } = body;

    if (!title || !userName) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

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

    
const [rows] = await db.query<RowDataPacket[]>(
  "SELECT * FROM posts WHERE id = ?",
  [(result as any).insertId]
);


    await db.end();

    return NextResponse.json({ success: true, post: rows[0] }); // send the new post
  } catch (err: any) {
    console.error("DB Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    const [rows] = await db.query("SELECT * FROM posts ORDER BY created_at DESC");
    await db.end();

    return NextResponse.json({ success: true, posts: rows });
  } catch (err: any) {
    console.error("DB Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
