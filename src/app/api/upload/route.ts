import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Hardcoded bucket name
const BUCKET_NAME = "leftoversnextjsbucket";

const s3 = new S3Client({
  region: process.env.AWS_REGION!, // still use env for credentials and region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const key = `leftovers_posts/${fileName}`;

    // Upload to S3
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ACL: undefined, // don't include ACL if your bucket doesn't allow it
      })
    );

    // Public URL
    const publicUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
    console.log("S3 upload successful:", publicUrl);

    return NextResponse.json({ success: true, media_url: publicUrl });
  } catch (err: any) {
    console.error("S3 Upload Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
