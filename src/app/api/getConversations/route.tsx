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

    // Fetch last message for each conversation with user avatar
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

    // Deduplicate by otherUser, keeping only the latest message
    const seen = new Set<string>();
    const conversations = [];
    for (const row of rows as any[]) {
      if (!seen.has(row.otherUser)) {
        // Fetch the other user's avatar from users table
        const [userRows] = await connection.execute(
          `SELECT profile_pic FROM users WHERE username = ? LIMIT 1`,
          [row.otherUser]
        );
        
        const otherUserAvatar = (userRows as any[])[0]?.profile_pic || null;
        
        conversations.push({
          id: row.otherUser, // can also generate a numeric id if you prefer
          otherUser: row.otherUser,
          otherUserAvatar: otherUserAvatar,
          lastMessage: row.message,
          updatedAt: row.created_at,
        });
        seen.add(row.otherUser);
      }
    }

    await connection.end();

    return NextResponse.json({ conversations });
  } catch (err: any) {
    console.error("Error fetching conversations:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}