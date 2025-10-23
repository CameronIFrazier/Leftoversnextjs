// Example Node.js/Next.js API route
import mysql from "mysql2/promise"; // assume this is your MySQL connection

// create a pool (recommended)
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
});


export async function POST(req: Request) {
  const { title, description, media_url, user_id } = await req.json();

  const [result] = await pool.execute(
    `INSERT INTO posts (user_id, title, description, media_url)
     VALUES (?, ?, ?, ?)`, 
    [user_id, title, description, media_url]
  );

  // result is of type ResultSetHeader
  return new Response(JSON.stringify({ success: true, postId: (result as any).insertId }));
}

