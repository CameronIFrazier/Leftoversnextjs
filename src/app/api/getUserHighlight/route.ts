// app/api/getUserHighlight/route.ts
import mysql, { RowDataPacket } from "mysql2/promise";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) return new Response("Unauthorized", { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT highlight FROM users WHERE email = ?",
      [payload.email]
    );

    await connection.end();

    if (!rows.length) return new Response("User not found", { status: 404 });

    return new Response(
      JSON.stringify({ highlight: rows[0].highlight }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
