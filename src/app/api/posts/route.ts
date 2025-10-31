import { NextResponse } from "next/server";
import mysql, { OkPacket } from "mysql2/promise";

// ✅ Create connection pool once (reuse for all requests)
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT),
});

export async function POST(req: Request) {
  try {
    const { title, description, media_url, username } = await req.json();

    if (!title || !username) {
      return NextResponse.json({ success: false, error: "Missing fields" });
    }

    // ✅ Use OkPacket instead of any
    const [result] = await pool.execute<OkPacket>(
      `INSERT INTO posts (username, title, description, media_url)
       VALUES (?, ?, ?, ?)`,
      [username, title, description, media_url]
    );
    const insertedId = result.insertId;

    // Fetch the newly created post including avatar and created_at
    const [rows] = await pool.execute(
      `SELECT p.id, p.title, p.description, p.media_url, p.created_at, p.username,
              u.profile_pic AS avatar
       FROM posts p
       LEFT JOIN users u ON p.username = u.userName
       WHERE p.id = ?`,
      [insertedId]
    );

    const createdPost = Array.isArray(rows) && rows.length ? rows[0] : null;

    return NextResponse.json({
      success: true,
      postId: insertedId,
      post: createdPost,
    });
  } catch (err: unknown) {
    console.error("Error creating post:", err);
    return NextResponse.json({ success: false, error: (err as Error).message });
  }
}
