// app/api/getUserBio/route.ts
import mysql, { RowDataPacket } from "mysql2/promise";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    // 1 Get the JWT from the Authorization header
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) return new Response("Unauthorized", { status: 401 });

    // 2 Verify token and extract email
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };

    // 3 Connect to the database
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    // 4 Query the bio
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT bio FROM users WHERE email = ?",
      [payload.email]
    );

    await connection.end();

    // 5 Check if the user exists
    if (!rows.length) return new Response("User not found", { status: 404 });

    // 6 Return the bio
    return new Response(
      JSON.stringify({ bio: rows[0].bio }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
