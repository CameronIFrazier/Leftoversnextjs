import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  turbopack: {
    resolveAlias: {
      'tw-animate-css': './node_modules/tw-animate-css/dist/tw-animate.css',
    },
  },
};

export default nextConfig;