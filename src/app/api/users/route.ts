import { NextResponse } from "next/server";
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

    // Select fields that actually exist in your table
    const [rows] = await connection.execute(
      `SELECT id, firstname, lastname, userName, profile_pic, bio, highlight FROM users`
    );

    await connection.end();

    // Map into a cleaner shape for your frontend
    const users = (rows as any[]).map((u) => ({
      id: u.id,
      name: `${u.firstname} ${u.lastname}`,
      username: u.userName,
      avatar: u.profile_pic,
      bio: u.bio,
      highlight: u.highlight,
    }));

    return NextResponse.json({ users });
  } catch (err: any) {
    console.error("Error loading users:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
