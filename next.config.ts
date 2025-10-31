import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip ESLint during builds to avoid linting generated runtime files
  // (e.g. Prisma's generated output) which often contain patterns
  // that trip strict workspace lint rules. Vercel/Next will still
  // run TypeScript checks during compilation; this only disables the
  // ESLint step during `next build`.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
