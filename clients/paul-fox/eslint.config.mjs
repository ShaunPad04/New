import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "node_modules/**", "next-env.d.ts"]),
  {
    rules: {
      // Media is hot-linked from paul-fox.com (see src/lib/assets.ts) and the
      // reference build uses plain <img> cover images; next/image would route
      // every request through the optimiser for no gain on a fixed asset set.
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
