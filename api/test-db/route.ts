import mysql from "mysql2/promise";

export async function GET() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: Number(process.env.MYSQL_PORT),
  });

  const [rows] = await connection.query("SELECT NOW() as now");
  await connection.end();

  return new Response(JSON.stringify({ success: true, rows }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
