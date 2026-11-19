import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ handler: vi.fn(), currentSession: vi.fn(), workspace: vi.fn(), changeWorkspace: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/modules/identity/auth", () => ({ getAuth: () => ({ handler: mocks.handler }) }));
vi.mock("@/modules/identity/service", () => ({ currentSession: mocks.currentSession, workspace: mocks.workspace, changeWorkspace: mocks.changeWorkspace }));
import { authenticationRequest, identityRequest } from "@/modules/identity/http";

const origin = "http://127.0.0.1:3000";
const post = (path: string, body: object, requestOrigin = origin) => new Request(`${origin}${path}`, { method: "POST", headers: { "Content-Type": "application/json", origin: requestOrigin, "x-plazahub-client": "spoofed" }, body: JSON.stringify(body) });
beforeEach(() => {
  vi.stubEnv("NODE_ENV", "test"); vi.stubEnv("PLAZAHUB_AUTH_MODE", "local");
  vi.stubEnv("BETTER_AUTH_URL", origin); vi.stubEnv("DATABASE_URL", "postgresql://localhost/plazahub_test");
  vi.stubEnv("BETTER_AUTH_SECRET", "unit-test-only-not-a-real-secret-value");
  mocks.handler.mockReset(); mocks.currentSession.mockReset(); mocks.workspace.mockReset(); mocks.changeWorkspace.mockReset();
});
afterEach(() => vi.unstubAllEnvs());

describe("HTTP boundaries using mocked persistence (not database evidence)", () => {
  it("closes all unapproved authentication and organization routes", async () => {
    for (const path of ["sign-up/email", "organization/create", "organization/set-active", "organization/remove-member", "request-password-reset"]) {
      expect((await authenticationRequest(post(`/api/auth/${path}`, {}))).status).toBe(404);
    }
    expect(mocks.handler).not.toHaveBeenCalled();
  });
  it("rejects cross-origin mutations before authentication", async () => {
    expect((await authenticationRequest(post("/api/auth/sign-in/email", {}, "https://hostile.example"))).status).toBe(403);
    expect((await identityRequest(post("/api/identity", {}, "https://hostile.example"))).status).toBe(403);
    expect(mocks.handler).not.toHaveBeenCalled(); expect(mocks.changeWorkspace).not.toHaveBeenCalled();
  });
  it("forwards secure cookies while stripping session tokens and request-controlled redirects", async () => {
    mocks.handler.mockResolvedValue(Response.json({ token: "must-not-escape", user: { email: "private@example.test" } }, { headers: { "Set-Cookie": "session=opaque; HttpOnly; SameSite=Lax" } }));
    const response = await authenticationRequest(post("/api/auth/sign-in/email", { email: "staff@example.test", password: "a-password", role: "owner", callbackURL: "https://hostile.example", rememberMe: false }));
    expect(await response.json()).toEqual({ ok: true, twoFactorRedirect: false });
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.getSetCookie()).toEqual(["session=opaque; HttpOnly; SameSite=Lax"]);
    const received = mocks.handler.mock.calls[0][0] as Request;
    expect(received.headers.get("x-plazahub-client")).toBe("127.0.0.1");
    expect(await received.json()).toEqual({ email: "staff@example.test", password: "a-password", rememberMe: true });
  });
  it("hides provider errors and distinguishes rate limiting without identifying accounts", async () => {
    mocks.handler.mockResolvedValueOnce(Response.json({ message: "private-account-detail" }, { status: 403 }));
    const failed = await authenticationRequest(post("/api/auth/sign-in/email", {}));
    expect(failed.status).toBe(401); expect(await failed.text()).not.toContain("private-account-detail");
    mocks.handler.mockResolvedValueOnce(Response.json({}, { status: 429 }));
    expect((await authenticationRequest(post("/api/auth/sign-in/email", {}))).status).toBe(429);
  });
  it("rejects oversized input before passing it to the provider", async () => {
    const response = await authenticationRequest(post("/api/auth/sign-in/email", { password: "x".repeat(9000) }));
    expect(response.status).toBe(400); expect(mocks.handler).not.toHaveBeenCalled();
  });
  it("reports provider failures as unavailable without exposing database details", async () => {
    mocks.handler.mockResolvedValue(Response.json({ message: "private-database-detail" }, { status: 500 }));
    const response = await authenticationRequest(post("/api/auth/sign-in/email", {}));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "Staff access is temporarily unavailable." });
    expect(response.headers.get("cache-control")).toContain("no-store");
  });
  it("never reads protected projections when no live session exists", async () => {
    mocks.currentSession.mockResolvedValue(null);
    const response = await identityRequest(new Request(`${origin}/api/identity`));
    expect(response.status).toBe(401); expect(mocks.workspace).not.toHaveBeenCalled();
  });
});
