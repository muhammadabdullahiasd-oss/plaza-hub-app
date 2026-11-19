// @vitest-environment node
import { randomBytes } from "node:crypto";
import { Pool } from "pg";
import { afterEach, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
import { createAuth } from "@/modules/identity/auth";
import { disconnectPrisma } from "@/lib/db/client";

afterEach(async () => {
  await disconnectPrisma();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

it("the generated Prisma models satisfy the installed Better Auth configuration without a database connection", async () => {
  // Fail immediately if this metadata-only contract ever tries to use PostgreSQL.
  const connect = vi.spyOn(Pool.prototype, "connect").mockImplementation(() => {
    throw new Error("Metadata checks must not connect to PostgreSQL.");
  });
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("PLAZAHUB_AUTH_MODE", "local");
  vi.stubEnv("DATABASE_URL", "postgresql://127.0.0.1/plazahub_metadata_only");
  vi.stubEnv("BETTER_AUTH_URL", "http://127.0.0.1:3101");
  vi.stubEnv("BETTER_AUTH_SECRET", randomBytes(48).toString("base64url"));

  const context = await createAuth().$context;
  if (!context.explicitSchemaCheck) throw new Error("The Prisma adapter must expose its generated-model schema check.");
  expect(context.explicitSchemaCheck.source).toBe("prisma");
  await context.explicitSchemaCheck();
  expect(connect).not.toHaveBeenCalled();
});
