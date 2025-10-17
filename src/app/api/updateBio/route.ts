// app/api/updateBio/route.ts
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) return new Response("Unauthorized", { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    const { bio } = await req.json();

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    await connection.query("UPDATE users SET bio = ? WHERE email = ?", [bio, payload.email]);

    await connection.end();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
