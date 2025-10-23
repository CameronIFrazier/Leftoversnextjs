import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

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
    const { title, description, media_url, username  } = await req.json();

    if (!title || !username ) {
      return NextResponse.json({ success: false, error: "Missing fields" });
    }

    const [result] = await pool.execute(
      `INSERT INTO posts (username, title, description, media_url)
       VALUES (?, ?, ?, ?)`,
      [username , title, description, media_url]
    );

    return NextResponse.json({
      success: true,
      postId: (result as any).insertId,
    });
  } catch (err: any) {
    console.error("Error creating post:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
