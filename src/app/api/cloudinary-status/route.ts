import { NextResponse } from "next/server";

export async function GET() {
  const cloudName = !!(process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  const apiKey = !!(process.env.CLOUDINARY_API_KEY ?? process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
  const apiSecret = !!(process.env.CLOUDINARY_API_SECRET ?? process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET);

  return NextResponse.json({
    cloudName,
    apiKey,
    apiSecret,
    env: process.env.NODE_ENV ?? null,
  });
}
