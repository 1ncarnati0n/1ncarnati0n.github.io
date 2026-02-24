import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextCoreWebVitals,
  globalIgnores([
    ".next/**",
    "dist/**",
    "node_modules/**",
    "out/**",
    "public/search-index.json",
  ]),
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-page-custom-font": "off",
      "react-hooks/set-state-in-effect": "warn",
      "prefer-const": "warn",
    },
  },
]);
