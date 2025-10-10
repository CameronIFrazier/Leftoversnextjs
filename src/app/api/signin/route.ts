import mysql, { RowDataPacket } from "mysql2/promise";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    // Only type rows; ignore fields with _
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

    // Successfully signed in
    return new Response(
      JSON.stringify({ success: true, message: "Signed in!", userId: rows[0].id }),
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
