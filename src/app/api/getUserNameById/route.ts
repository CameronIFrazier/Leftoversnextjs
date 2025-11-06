// src/app/api/getUserNameById/route.ts
import mysql from "mysql2/promise";
import { RowDataPacket } from "mysql2";

type UserRow = RowDataPacket & {
  userName: string; // match your DB column casing
};

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("userId");
    const userId = Number(userIdParam);

    if (!userIdParam || !Number.isFinite(userId)) {
      return new Response(JSON.stringify({ error: "Invalid or missing userId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT || 3306),
    });

    // Use your column name exactly as in DB: userName (camelCase)
    const [rows] = await connection.execute<UserRow[]>(
      "SELECT userName FROM users WHERE id = ? LIMIT 1",
      [userId]
    );

    await connection.end();

    const user = rows[0];
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ userName: user.userName }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("getUserNameById error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
