import { localDatabaseUrl } from "@/lib/db/local-config";

export class IdentityUnavailable extends Error {
  constructor() { super("Staff access is not configured for this environment."); }
}

/** Production stays closed pending verified MFA/recovery and deployment review. */
export function identityConfig(env: NodeJS.ProcessEnv = process.env) {
  if (env.NODE_ENV === "production" || env.PLAZAHUB_AUTH_MODE !== "local" || !env.DATABASE_URL || !env.BETTER_AUTH_SECRET || env.BETTER_AUTH_SECRET.length < 32) throw new IdentityUnavailable();
  let url: URL;
  try {
    url = new URL(env.BETTER_AUTH_URL ?? "");
    localDatabaseUrl(env.DATABASE_URL);
  } catch { throw new IdentityUnavailable(); }
  if (!["http:", "https:"].includes(url.protocol) || !["127.0.0.1", "localhost", "[::1]"].includes(url.hostname) || url.username || url.password || url.search || url.hash || url.pathname !== "/") throw new IdentityUnavailable();
  return { baseURL: url.origin, secret: env.BETTER_AUTH_SECRET, secureCookies: url.protocol === "https:" };
}

export function identityAvailable() {
  try { identityConfig(); return true; } catch { return false; }
}

export function sameOriginRequest(request: Request, origin: string): boolean {
  return new URL(request.url).origin === origin && request.headers.get("origin") === origin;
}
