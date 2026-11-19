import "dotenv/config";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../src/generated/prisma/client";
import { localDatabaseUrl } from "../src/lib/db/local-config";
import { identityConfig } from "../src/modules/identity/config";

async function bootstrap() {
  identityConfig();
  if (process.env.NODE_ENV === "production" || process.env.PLAZAHUB_BOOTSTRAP_CONFIRM !== "local-empty-database") throw new Error("Local empty-database confirmation is required.");
  const connectionString = localDatabaseUrl(process.env.DATABASE_URL);
  if (!new URL(connectionString).pathname.endsWith("_dev")) throw new Error("Bootstrap requires a confirmed local database ending in _dev.");
  const email = process.env.PLAZAHUB_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const name = process.env.PLAZAHUB_BOOTSTRAP_NAME?.trim();
  const organization = process.env.PLAZAHUB_BOOTSTRAP_ORGANIZATION?.trim();
  const slug = process.env.PLAZAHUB_BOOTSTRAP_SLUG?.trim();
  const password = process.env.PLAZAHUB_BOOTSTRAP_PASSWORD;
  delete process.env.PLAZAHUB_BOOTSTRAP_PASSWORD;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !name || name.length > 100 || !organization || organization.length > 150 || !slug || !/^[a-z0-9-]{1,60}$/.test(slug) || !password || password.length < 12 || password.length > 128) throw new Error("Provide valid owner, organization and password inputs as described in README.");
  const digest = await hashPassword(password);
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString, connectionTimeoutMillis: 5000 }) });
  try {
    await db.$transaction(async (tx) => {
      if (await tx.user.count() || await tx.organization.count()) throw new Error("Bootstrap refuses a populated identity database.");
      const userId = randomUUID(); const organizationId = randomUUID(); const memberId = randomUUID();
      await tx.user.create({ data: { id: userId, name, email, emailVerified: false } });
      await tx.account.create({ data: { id: randomUUID(), accountId: userId, userId, providerId: "credential", password: digest } });
      await tx.organization.create({ data: { id: organizationId, name: organization, slug } });
      await tx.member.create({ data: { id: memberId, userId, organizationId, role: "owner" } });
      await tx.identityAuditEvent.create({ data: { organizationId, actorId: userId, action: "local.owner_bootstrapped", targetId: memberId, nextRole: "owner" } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    console.info("Local owner created. No platform privilege or verified email was assigned.");
  } finally { await db.$disconnect(); }
}

bootstrap().catch(() => { console.error("Bootstrap failed or was refused. Confirm local configuration, input requirements and an empty migrated identity database. No credentials are logged."); process.exitCode = 1; });
