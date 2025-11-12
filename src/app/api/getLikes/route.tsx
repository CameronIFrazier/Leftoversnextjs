import mysql from "mysql2/promise";

export async function GET() {
  try {
    const pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    const [rows]: any = await pool.execute(`
      SELECT post_id, COUNT(*) as like_count, 
             GROUP_CONCAT(user_id) as user_ids
      FROM likes
      GROUP BY post_id
    `);

    // This lets frontend know which users liked which post
    const formatted = rows.map((r: any) => ({
      postId: r.post_id,
      likeCount: Number(r.like_count),
      userIds: r.user_ids ? r.user_ids.split(",").map(Number) : [],
    }));

    return new Response(JSON.stringify(formatted), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
