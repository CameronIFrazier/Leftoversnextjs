import { NextResponse } from "next/server";
import cloudinary from "../lib/cloudinary";
import { writeFile } from "fs/promises";
import os from "os";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create OS-safe temp path
    const tempFilePath = path.join(os.tmpdir(), `${Date.now()}-${file.name}`);

    // Write file to temp directory
    await writeFile(tempFilePath, buffer);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: "leftovers",
      resource_type: "auto",
    });

    return NextResponse.json({
      url: result.secure_url,
      type: result.resource_type,
      public_id: result.public_id,
    });

  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
