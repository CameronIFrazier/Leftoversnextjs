export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import cloudinary, { initCloudinary } from "@/lib/cloudinary";
import mysql, { RowDataPacket } from "mysql2/promise";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

type UserRow = RowDataPacket & {
  profile_pic: string | null;
};

export const POST = async (req: NextRequest) => {
  // Extract token
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ success: false, error: "No token" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];

  let email: string;
  try {
    const payload = verify(token, process.env.JWT_SECRET!) as { email: string };
    email = payload.email;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
  }

  try {
    // Ensure cloudinary initialized with runtime envs
    initCloudinary();
    const formData = await req.formData();
    const file = formData.get("pfp") as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Connect to MySQL
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    // Get old profile picture URL
    const [rows] = await connection.execute<UserRow[]>(
      "SELECT profile_pic FROM users WHERE email = ?",
      [email]
    );
    const oldUrl = rows[0]?.profile_pic;

    // Delete old uploaded PFP from Cloudinary if exists
    if (oldUrl && oldUrl.includes("cloudinary")) {
      try {
        // Extract public_id from Cloudinary URL
        const publicId = oldUrl.split("/").pop()?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`leftovers_pfps/${publicId}`);
        }
      } catch (deleteErr) {
        console.error("Failed to delete old pfp from Cloudinary:", deleteErr);
        // Continue anyway
      }
    }

    // Upload new file to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "leftovers_pfps",
          resource_type: "auto",
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

    const newUrl = (uploadResult as any).secure_url;

    // Update MySQL
    await connection.execute("UPDATE users SET profile_pic = ? WHERE email = ?", [newUrl, email]);
    await connection.end();

    return NextResponse.json({ success: true, url: newUrl }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
};
