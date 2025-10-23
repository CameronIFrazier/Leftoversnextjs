import mysql from "mysql2/promise";

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
    const username = url.searchParams.get("username");

    if (!username) {
      return new Response(
        JSON.stringify({ error: "Missing username parameter" }),
        { status: 400 }
      );
    }

    const [rows] = await pool.execute(
      `SELECT id, title, description, media_url, created_at 
       FROM posts 
       WHERE username = ? 
       ORDER BY created_at DESC`,
      [username]
    );

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err) {
    console.error("Error fetching posts:", err);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
    });
  }
}
