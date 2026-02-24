// app/api/getUserBioById/route.ts
import mysql, { RowDataPacket } from "mysql2/promise";

export async function GET(req: Request) {
  try {
    // 1) Read userId from query
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("userId");
    const userId = Number(userIdParam);

    if (!userIdParam || !Number.isFinite(userId)) {
      return new Response(JSON.stringify({ error: "Invalid or missing userId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2) Connect to the database
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    // 3) Query the bio by user id
   const [rows] = await connection.query<RowDataPacket[]>(
  "SELECT bio, profile_pic FROM users WHERE id = ? LIMIT 1",
  [userId]
);

await connection.end();

if (!rows.length) {
  return new Response(JSON.stringify({ error: "User not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}

return new Response(JSON.stringify({ bio: rows[0].bio, profile_pic: rows[0].profile_pic }), {
  status: 200,
  headers: { "Content-Type": "application/json" },
});

    await connection.end();

    // 4) Handle not found
    if (!rows.length) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 5) Return the bio (same response shape as your JWT route)
    return new Response(JSON.stringify({ bio: rows[0].bio }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
