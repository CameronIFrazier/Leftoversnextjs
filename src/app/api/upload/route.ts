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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const key = `leftovers_posts/${fileName}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!, // ✅ use server-side env
        Key: key,
        Body: buffer,
        ContentType: file.type,
         // ❌ remove ACL to fix AccessControlListNotSupported
      })
    );

    const publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
    console.log("S3 upload successful:", publicUrl);

    return NextResponse.json({ success: true, media_url: publicUrl });
  } catch (err: any) {
    console.error("S3 Upload Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
