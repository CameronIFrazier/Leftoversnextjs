import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

module.exports = {
  root: true,
  extends: ["next", "next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  ignorePatterns: [
    "src/generated/**", // ignore Prisma generated files
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
  ],
  rules: {
    // your custom ESLint rules
  },
};

export default eslintConfig;
