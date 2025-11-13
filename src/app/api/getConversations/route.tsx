// File: src/app/api/getConversations/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const currentUser = searchParams.get("user");
    if (!currentUser) {
      return NextResponse.json({ error: "Missing user parameter" }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    // Fetch last message for each conversation
    const [rows] = await connection.execute(
      `
      SELECT
        CASE
          WHEN sender = ? THEN receiver
          ELSE sender
        END AS otherUser,
        message,
        created_at
      FROM messages
      WHERE sender = ? OR receiver = ?
      ORDER BY created_at DESC
      `,
      [currentUser, currentUser, currentUser]
    );

    await connection.end();

    // Deduplicate by otherUser, keeping only the latest message
    const seen = new Set<string>();
    const conversations = [];
    for (const row of rows as any[]) {
      if (!seen.has(row.otherUser)) {
        conversations.push({
          id: row.otherUser, // can also generate a numeric id if you prefer
          otherUser: row.otherUser,
          lastMessage: row.message,
          updatedAt: row.created_at,
        });
        seen.add(row.otherUser);
      }
    }

    return NextResponse.json({ conversations });
  } catch (err: any) {
    console.error("Error fetching conversations:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}