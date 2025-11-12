import mysql, { RowDataPacket } from "mysql2/promise";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  try {
    const { email, password } = await req.json();

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    await connection.end();

    if (!rows.length) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid credentials" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = rows[0];

    // Include numeric user ID in JWT
    const token = jwt.sign(
      {
        id: user.id,       // numeric ID
        email: user.email, // optional, for convenience
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Signed in!",
        token,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
