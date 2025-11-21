// src/app/api/upload/route.ts
import { NextResponse } from "next/server";
import cloudinary from "../../../lib/cloudinary";
import { writeFile } from "fs/promises";
import os from "os";
import path from "path";

export const runtime = "nodejs";

export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("Uploading file:", file.name, file.type, buffer.byteLength, "bytes");

    // Create OS-safe temporary file path
    const tempFilePath = path.join(os.tmpdir(), `${Date.now()}-${file.name}`);
    await writeFile(tempFilePath, buffer);
    console.log("Temporary file written:", tempFilePath);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: "leftovers_posts",
      resource_type: "auto", // supports images and videos
    });

    console.log("Cloudinary upload successful:", result.secure_url);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      type: result.resource_type,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
