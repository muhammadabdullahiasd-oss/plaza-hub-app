import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { organization, twoFactor } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { nextCookies } from "better-auth/next-js";
import { getPrisma } from "@/lib/db/client";
import { identityConfig } from "./config";

const ac = createAccessControl({ organization: ["read"], member: ["read", "update", "delete"], invitation: ["create", "cancel"] } as const);

export function createAuth() {
  const config = identityConfig();
  return betterAuth({
    appName: "PlazaHub",
    baseURL: config.baseURL,
    secret: config.secret,
    trustedOrigins: [config.baseURL],
    database: prismaAdapter(getPrisma(), { provider: "postgresql", transaction: true }),
    emailAndPassword: { enabled: true, disableSignUp: true, minPasswordLength: 12, maxPasswordLength: 128, revokeSessionsOnPasswordReset: true },
    account: { accountLinking: { enabled: false } },
    user: { additionalFields: { platformRole: { type: "string", required: false, input: false, returned: false } } },
    session: { expiresIn: 60 * 60 * 8, updateAge: 60 * 60, cookieCache: { enabled: false } },
    rateLimit: { enabled: true, storage: "database", window: 60, max: 60, customRules: { "/sign-in/email": { window: 60, max: 5 } } },
    advanced: {
      useSecureCookies: config.secureCookies,
      defaultCookieAttributes: { httpOnly: true, sameSite: "lax", path: "/" },
      ipAddress: { ipAddressHeaders: ["x-plazahub-client"] },
    },
    logger: { disabled: true },
    plugins: [
      organization({
        allowUserToCreateOrganization: false,
        requireEmailVerificationOnInvitation: true,
        ac,
        roles: {
          owner: ac.newRole({ organization: ["read"], member: ["read", "update", "delete"], invitation: ["create", "cancel"] }),
          manager: ac.newRole({ organization: ["read"] }),
          accountant: ac.newRole({ organization: ["read"] }),
        },
        schema: { member: { additionalFields: { revokedAt: { type: "date", required: false, input: false } } } },
      }),
      twoFactor({ issuer: "PlazaHub" }),
      nextCookies(),
    ],
  });
}

let instance: ReturnType<typeof createAuth> | undefined;
export function getAuth() { return instance ??= createAuth(); }
