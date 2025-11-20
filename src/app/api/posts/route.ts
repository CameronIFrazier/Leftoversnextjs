import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { v2 as cloudinary } from "cloudinary";
import mysql, { OkPacket } from "mysql2/promise";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title")?.toString() ?? "";
    const description = formData.get("description")?.toString() ?? "";
    const username = formData.get("username")?.toString() ?? "";
    const mediaFile = formData.get("media") as File | null;

    if (!title || !username) {
      return NextResponse.json({ success: false, error: "Missing fields" });
    }

    let media_url: string | null = null;

    if (mediaFile) {
      const buffer = Buffer.from(await mediaFile.arrayBuffer());
      const result: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "leftovers_posts", resource_type: "auto" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });
      media_url = result.secure_url;
    }

    const [result] = await pool.execute<OkPacket>(
      `INSERT INTO posts (username, title, description, media_url) VALUES (?, ?, ?, ?)`,
      [username, title, description, media_url]
    );

    const insertedId = result.insertId;

    const [rows] = await pool.execute(
      `SELECT p.id, p.title, p.description, p.media_url, p.created_at, p.username,
              u.profile_pic AS avatar
       FROM posts p
       LEFT JOIN users u ON p.username = u.userName
       WHERE p.id = ?`,
      [insertedId]
    );

    const createdPost = Array.isArray(rows) && rows.length ? rows[0] : null;

    return NextResponse.json({ success: true, post: createdPost });
  } catch (err: unknown) {
    console.error("Error creating post:", err);
    return NextResponse.json({ success: false, error: (err as Error).message });
  }
}
