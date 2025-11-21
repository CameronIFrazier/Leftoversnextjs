import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
  api: {
    bodyParser: false, // ✅ disable body parser for file uploads
  },
};

export default nextConfig;
