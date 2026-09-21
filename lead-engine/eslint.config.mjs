import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  { ignores: [".next/**", "node_modules/**", "data/**"] },
  ...coreWebVitals,
  ...nextTypescript,
];

export default config;
