import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
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

    const arrayBuffer = await file.arrayBuffer(); // convert File to ArrayBuffer
    const buffer = Buffer.from(arrayBuffer);      // convert to Node.js Buffer

    const key = `leftovers_posts/${Date.now()}-${file.name}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
        Key: key,
        Body: buffer,          // use Buffer here
        ContentType: file.type,
      })
    );

    const fileUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;

    return NextResponse.json({ success: true, fileUrl });
  } catch (err: any) {
    console.error("Upload API Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
