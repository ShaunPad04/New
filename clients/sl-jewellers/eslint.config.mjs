import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

// eslint-config-next 15 is an eslintrc-style config. Loading it through FlatCompat lets its
// @rushstack/eslint-patch find the module it expects to patch; importing it directly into a
// flat config is what made `pnpm lint` (and the lint step of `next build`) fail.
const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const config = [
  { ignores: [".next/**", "node_modules/**", "docs/**", "assets/**", "scripts/**", "next-env.d.ts"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default config;
