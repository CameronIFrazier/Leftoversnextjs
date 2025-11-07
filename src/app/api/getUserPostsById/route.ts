// app/api/getUserPostsById/route.ts
import mysql from "mysql2/promise";

export const runtime = "nodejs";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userIdParam = url.searchParams.get("userId");
    const userId = Number(userIdParam);

    if (!userIdParam || !Number.isFinite(userId)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing userId parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // If posts are keyed by username, join users to translate id -> userName.
    const [rows] = await pool.execute(
      `
      SELECT
        p.id,
        p.title,
        p.description,
        p.media_url,
        p.created_at,
        p.username,
        u.profile_pic AS avatar
      FROM posts p
      LEFT JOIN users u
        ON p.username = u.userName
      WHERE u.id = ?
      ORDER BY p.created_at DESC
      `,
      [userId]
    );

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Error fetching posts by userId:", {
      message: err?.message,
      code: err?.code,
      sqlState: err?.sqlState,
    });
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
