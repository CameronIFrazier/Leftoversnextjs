import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return new Response(JSON.stringify({ success: true, users }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

{/**import mysql from "mysql2/promise"; old

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
    
    
    
    
    import mysql from "mysql2/promise"; very old

export default async function handler(req, res) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    const [rows] = await connection.query("SELECT NOW() as now");
    await connection.end();

    res.status(200).json({ success: true, rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
 */}