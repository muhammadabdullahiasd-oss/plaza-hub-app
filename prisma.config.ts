import "dotenv/config";
import { defineConfig } from "prisma/config";
import { localDatabaseUrl } from "./src/lib/db/local-config";

// Validation/generation need no live database or secret.
// This task's CLI configuration refuses non-loopback database hosts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url: localDatabaseUrl(process.env.DATABASE_URL) },
});
