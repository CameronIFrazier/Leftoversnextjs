import mysql from "mysql2/promise";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    // Try to include username and avatar (profile_pic) for each comment by joining users.
    // Some databases may not have a `username` column on comments yet; if so, fall back
    // to a simpler select to avoid crashing.
    let rows: any;
    try {
      [rows] = await connection.execute(
        `SELECT c.id, c.post_id, c.comment_text, c.parent_comment_id, c.created_at, c.username,
                u.profile_pic AS avatar
         FROM comments c
         LEFT JOIN users u ON c.username = u.userName
         ORDER BY c.created_at ASC`
      );
    } catch (err) {
      console.warn("getComments: joined query failed, falling back to basic select:", err);
      const [fallbackRows] = await connection.execute(
        `SELECT id, post_id, comment_text, parent_comment_id, created_at FROM comments ORDER BY created_at ASC`
      );
      rows = fallbackRows;
    }

    await connection.end();

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err) {
    console.error("Error fetching comments:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
