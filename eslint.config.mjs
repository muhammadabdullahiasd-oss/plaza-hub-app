import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**", "out/**", "dist/**", "next-env.d.ts",
    "src/generated/**", "playwright-report/**", "test-results/**", "coverage/**",
    ".cache/**", ".tools/**",
  ]),
  {
    files: ["src/app/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["@prisma/*", "pg", "@/generated/*", "@/lib/db/*"],
          message: "UI/routes must use a module service, not database infrastructure directly.",
        }],
      }],
    },
  },
]);
