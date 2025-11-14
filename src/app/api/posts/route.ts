import { NextResponse } from "next/server";
import mysql, { OkPacket } from "mysql2/promise";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Create connection pool once (reuse for all requests)
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const username = formData.get("username") as string;
    const mediaFile = formData.get("media") as File | null;

    if (!title || !username) {
      return NextResponse.json({ success: false, error: "Missing fields" });
    }

    let media_url: string | null = null;

    // Handle file upload if media exists
    if (mediaFile) {
      try {
        const bytes = await mediaFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "leftovers_posts",
              resource_type: "auto", // auto-detect image or video
              use_filename: true,
              unique_filename: true,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          uploadStream.end(buffer);
        });

        media_url = (result as any).secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr);
        return NextResponse.json({ success: false, error: "Failed to upload file to cloud" });
      }
    }

    // ✅ Use OkPacket instead of any
    const [result] = await pool.execute<OkPacket>(
      `INSERT INTO posts (username, title, description, media_url)
       VALUES (?, ?, ?, ?)`,
      [username, title, description, media_url]
    );
    const insertedId = result.insertId;

    // Fetch the newly created post including avatar and created_at
    const [rows] = await pool.execute(
      `SELECT p.id, p.title, p.description, p.media_url, p.created_at, p.username,
              u.profile_pic AS avatar
       FROM posts p
       LEFT JOIN users u ON p.username = u.userName
       WHERE p.id = ?`,
      [insertedId]
    );

    const createdPost = Array.isArray(rows) && rows.length ? rows[0] : null;

    return NextResponse.json({
      success: true,
      postId: insertedId,
      post: createdPost,
      media_url: media_url,
    });
  } catch (err: unknown) {
    console.error("Error creating post:", err);
    return NextResponse.json({ success: false, error: (err as Error).message });
  }
}
