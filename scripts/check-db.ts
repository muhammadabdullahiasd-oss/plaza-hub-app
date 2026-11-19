import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { localDatabaseUrl } from "../src/lib/db/local-config";

// Explicit opt-in probe only. No schema writes or migrations, and no remote URL.
const client = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: localDatabaseUrl(process.env.DATABASE_URL),
    connectionTimeoutMillis: 5_000,
    max: 1,
  }),
});

try {
  const rows = await client.$queryRaw<Array<{ ok: number }>>`SELECT 1 AS ok`;
  if (rows[0]?.ok !== 1) throw new Error("Unexpected probe result");
  console.log("Local PostgreSQL connectivity verified with SELECT 1; no schema changed.");
} catch {
  console.error("Local PostgreSQL probe failed. Check the local service and .env. No connectivity verified.");
  process.exitCode = 1;
} finally {
  await client.$disconnect();
}
