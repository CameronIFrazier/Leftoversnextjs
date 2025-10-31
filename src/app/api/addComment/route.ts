import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
  const { postId, comment, parentCommentId = null, username: providedUsername = null } = await req.json();

    if (!postId || !comment) {
      return new Response(JSON.stringify({ error: "Missing postId or comment" }), { status: 400 });
    }

    // Prefer username provided by the client (frontend can include it after decoding token client-side).
    // If not provided, fall back to resolving via JWT token (existing behavior).
    let username: string | null = providedUsername ?? null;

    if (!username) {
      const authHeader = req.headers.get("authorization");
      if (authHeader) {
        try {
          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email?: string };

          if (decoded?.email) {
            // Lookup userName by email
            const conn = await mysql.createConnection({
              host: process.env.MYSQL_HOST,
              user: process.env.MYSQL_USER,
              password: process.env.MYSQL_PASSWORD,
              database: process.env.MYSQL_DATABASE,
              port: Number(process.env.MYSQL_PORT),
            });

            const [rows] = await conn.execute(
              "SELECT userName FROM users WHERE email = ? LIMIT 1",
              [decoded.email]
            );

            await conn.end();

            // rows may be RowDataPacket[]; guard access
            if (Array.isArray(rows) && rows.length > 0) {
              // @ts-expect-error — rows type comes from mysql driver, we're asserting the shape
              username = rows[0].userName || null;
            }
          }
        } catch (err) {
          console.warn("Could not decode token for addComment:", err);
        }
      }
    }

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    if (username) {
      try {
        await connection.execute(
          "INSERT INTO comments (post_id, comment_text, parent_comment_id, username) VALUES (?, ?, ?, ?)",
          [postId, comment, parentCommentId, username]
        );
      } catch (err) {
        console.warn("Insert with username failed, retrying without username:", err);
        await connection.execute(
          "INSERT INTO comments (post_id, comment_text, parent_comment_id) VALUES (?, ?, ?)",
          [postId, comment, parentCommentId]
        );
      }
    } else {
      // Insert without username if we couldn't resolve it
      await connection.execute(
        "INSERT INTO comments (post_id, comment_text, parent_comment_id) VALUES (?, ?, ?)",
        [postId, comment, parentCommentId]
      );
    }

    await connection.end();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error adding comment:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
