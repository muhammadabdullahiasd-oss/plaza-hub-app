import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { localDatabaseUrl } from "./local-config";

const globalDatabase = globalThis as unknown as {
  plazahubPrisma?: PrismaClient;
};

/** Lazy, server-only lifecycle. Importing the app never opens a connection. */
export function getPrisma(): PrismaClient {
  if (!globalDatabase.plazahubPrisma) {
    const adapter = new PrismaPg({
      connectionString: localDatabaseUrl(process.env.DATABASE_URL),
      max: 5,
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 30_000,
    });
    globalDatabase.plazahubPrisma = new PrismaClient({ adapter });
  }
  return globalDatabase.plazahubPrisma;
}

/** For an explicitly managed shutdown, never at the end of each request. */
export async function disconnectPrisma(): Promise<void> {
  const client = globalDatabase.plazahubPrisma;
  globalDatabase.plazahubPrisma = undefined;
  await client?.$disconnect();
}
