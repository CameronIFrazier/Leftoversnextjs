import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? "✓ Set" : "✗ Missing",
    apiKey: process.env.CLOUDINARY_API_KEY ? "✓ Set" : "✗ Missing",
    apiSecret: process.env.CLOUDINARY_API_SECRET ? "✓ Set" : "✗ Missing",
    nodeEnv: process.env.NODE_ENV,
  });
}
