import "dotenv/config";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { localDatabaseUrl } from "./src/lib/db/local-config";

const supplied = process.env.PLAZAHUB_TEST_DATABASE_URL;
if (!supplied || process.env.PLAZAHUB_TEST_DB_CONFIRMED !== "YES") {
  throw new Error("BLOCKED: real PostgreSQL tests require PLAZAHUB_TEST_DATABASE_URL and PLAZAHUB_TEST_DB_CONFIRMED=YES for a dedicated local database. Zero integration tests executed.");
}
const databaseURL = localDatabaseUrl(supplied);
if (!new URL(databaseURL).pathname.endsWith("_test")) throw new Error("BLOCKED: integration database name must end in _test.");

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)), "server-only": fileURLToPath(new URL("./tests/integration/server-only.ts", import.meta.url)) } },
  test: {
    environment: "node",
    include: ["tests/integration/**/*.test.ts"],
    fileParallelism: false,
    testTimeout: 15000,
    hookTimeout: 30000,
    env: { NODE_ENV: "test", DATABASE_URL: databaseURL, PLAZAHUB_AUTH_MODE: "local", BETTER_AUTH_URL: "http://127.0.0.1:3101", BETTER_AUTH_SECRET: randomBytes(48).toString("base64url") },
  },
});
