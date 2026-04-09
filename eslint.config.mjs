import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import security from "eslint-plugin-security";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Security-focused lint rules
  {
    plugins: { security: security },
    rules: {
      ...security.configs.recommended.rules,
      "security/detect-non-literal-fs-filename": "off", // Article content loading is intentional
      "security/detect-object-injection": "off", // Article key iteration is safe
    },
  },
  // Content-heavy TSX articles use a lot of inline prose; enforcing entity escaping is noisy and low value here.
  {
    files: ["content/articles/**/*.tsx", "content/system-design-concepts/**/*.tsx"],
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Example code is displayed as content and is not meant to follow repo lint rules.
    "content/examples/**",
  ]),
]);

export default eslintConfig;
