import mysql from "mysql2/promise";

export async function POST(req: Request) {
  try {
    const { userId, postId } = await req.json();

    if (!userId || !postId) {
      return new Response(JSON.stringify({ error: "Missing userId or postId" }), { status: 400 });
    }

    const pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    // Check if the user already liked the post
    const [existing]: any = await pool.execute(
      `SELECT * FROM likes WHERE user_id = ? AND post_id = ?`,
      [userId, postId]
    );

    let liked = false;

    if (existing.length > 0) {
      // User already liked → remove like (unlike)
      await pool.execute(`DELETE FROM likes WHERE user_id = ? AND post_id = ?`, [userId, postId]);
      liked = false;
    } else {
      // User hasn't liked → add like
      await pool.execute(`INSERT INTO likes (user_id, post_id) VALUES (?, ?)`, [userId, postId]);
      liked = true;
    }

    // Return updated like status
    return new Response(JSON.stringify({ liked }), { status: 200 });
  } catch (err) {
    console.error("Error toggling like:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
