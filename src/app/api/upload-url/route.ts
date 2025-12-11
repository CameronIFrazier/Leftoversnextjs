// src/app/api/upload/route.ts
import { NextResponse } from "next/server";
import AWS from "aws-sdk";

export const runtime = "nodejs";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `posts/${Date.now()}-${file.name}`;

    await s3
      .putObject({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read",
      })
      .promise();

    const media_url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;

    return NextResponse.json({ success: true, media_url });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
