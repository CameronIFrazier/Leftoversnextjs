
import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary at request/runtime time to ensure Vercel
// environment variables are available (avoids build-time config issues)
export function initCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY ?? process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET ?? process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn("Cloudinary credentials missing at runtime:", {
      cloudName: !!cloudName,
      apiKey: !!apiKey,
      apiSecret: !!apiSecret,
    });
  }

  cloudinary.config({
    cloud_name: cloudName as string,
    api_key: apiKey as string,
    api_secret: apiSecret as string,
  });

  return cloudinary;
}

export default cloudinary;