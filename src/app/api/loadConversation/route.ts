import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userA = searchParams.get("userA");
  const userB = searchParams.get("userB");

   if (!userA || !userB || userB === "null") {
    return NextResponse.json({ error: "Missing or invalid users" }, { status: 400 });
  }


  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    const [rows] = await connection.execute(
      `SELECT sender, receiver, message, created_at 
       FROM messages
       WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)
       ORDER BY created_at ASC`,
      [userA, userB, userB, userA]
    );
    await connection.end();

    return NextResponse.json({ messages: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
  }
}
