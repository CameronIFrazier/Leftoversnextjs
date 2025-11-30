// /app/api/upload-url/route.ts
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const { fileName, fileType, size } = await req.json();

    if (!fileName || !fileType) {
      return NextResponse.json({ error: "Missing file data" }, { status: 400 });
    }

    // Optional: prevent 2GB videos from kids
    const MAX_MB = 200;
    if (size > MAX_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `File too large. Max allowed is ${MAX_MB}MB.` },
        { status: 413 }
      );
    }

    const key = `leftovers_posts/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    return NextResponse.json({
      success: true,
      uploadUrl: signedUrl,
      fileUrl: `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
