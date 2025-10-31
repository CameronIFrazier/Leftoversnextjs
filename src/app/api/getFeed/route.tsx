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
  

  

    const [rows] = await pool.execute(
      `SELECT p.id, p.title, p.description, p.media_url, p.created_at, p.username,
              u.profile_pic AS avatar
       FROM posts p
       LEFT JOIN users u ON p.username = u.userName
       ORDER BY p.created_at DESC`
    );

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err) {
    console.error("Error fetching posts:", err);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
    });
  }
}
