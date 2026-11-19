import "server-only";
import { getAuth } from "./auth";
import { identityConfig, sameOriginRequest } from "./config";
import { AccessDenied } from "./policy";
import { changeWorkspace, currentSession, workspace } from "./service";

export function privateJson(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "Pragma": "no-cache", "Vary": "Cookie" } });
}

async function readJson(request: Request): Promise<unknown> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new AccessDenied();
  const reader = request.body?.getReader();
  if (!reader) throw new AccessDenied();
  let length = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > 8192) { await reader.cancel(); throw new AccessDenied(); }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw new AccessDenied(); }
}

const authPosts = new Set(["/sign-in/email", "/sign-out", "/two-factor/enable", "/two-factor/verify-totp", "/two-factor/verify-backup-code", "/two-factor/disable"]);

/** Do not expose raw organization APIs: they do not implement our revocation/audit policy. */
export async function authenticationRequest(request: Request) {
  const path = new URL(request.url).pathname.slice("/api/auth".length);
  if (request.method !== "POST" || !authPosts.has(path)) return privateJson({ error: "This operation is unavailable." }, 404);
  try {
    const config = identityConfig();
    if (!sameOriginRequest(request, config.baseURL)) return privateJson({ error: "Access is not available." }, 403);
    const body = await readJson(request);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new AccessDenied();
    const input = body as Record<string, unknown>;
    // Keep configured eight-hour expiry: Better Auth's rememberMe=false uses 24h.
    // Never accept client callback URLs or remembered second-factor devices.
    const payload = path === "/sign-in/email"
      ? { email: input.email, password: input.password, rememberMe: true }
      : path === "/two-factor/enable" || path === "/two-factor/disable"
        ? { password: input.password }
        : { code: input.code, trustDevice: false };
    const headers = new Headers(request.headers);
    headers.delete("content-length");
    // Constant, server-owned key for direct loopback development, never forwarded client input.
    headers.set("x-plazahub-client", "127.0.0.1");
    const response = await getAuth().handler(new Request(request.url, { method: "POST", headers, body: JSON.stringify(payload) }));
    if (response.status >= 500) return privateJson({ error: "Staff access is temporarily unavailable." }, 503);
    if (!response.ok) return privateJson({ error: response.status === 429 ? "Too many attempts. Try again later." : "Unable to authenticate. Check your details and try again." }, response.status === 429 ? 429 : 401);
    const data: unknown = await response.json();
    const result = data && typeof data === "object" ? data as Record<string, unknown> : {};
    const output = path === "/two-factor/enable" ? { totpURI: result.totpURI, backupCodes: result.backupCodes } : { ok: true, twoFactorRedirect: result.twoFactorRedirect === true };
    const outgoing = privateJson(output);
    for (const cookie of response.headers.getSetCookie()) outgoing.headers.append("Set-Cookie", cookie);
    return outgoing;
  } catch (error) {
    return privateJson({ error: error instanceof AccessDenied ? "Access is not available." : "Staff access is temporarily unavailable." }, error instanceof AccessDenied ? 400 : 503);
  }
}

export async function identityRequest(request: Request) {
  try {
    if (request.method !== "GET") {
      if (!sameOriginRequest(request, identityConfig().baseURL)) return privateJson({ error: "Access is not available." }, 403);
    }
    const identity = await currentSession(request.headers);
    if (!identity) return privateJson({ error: "Sign in to continue." }, 401);
    if (request.method === "GET") return privateJson(await workspace(identity));
    await changeWorkspace(identity, await readJson(request));
    return privateJson({ ok: true });
  } catch (error) {
    return privateJson({ error: error instanceof AccessDenied ? "Access is not available." : "Staff access is temporarily unavailable." }, error instanceof AccessDenied ? 403 : 503);
  }
}
