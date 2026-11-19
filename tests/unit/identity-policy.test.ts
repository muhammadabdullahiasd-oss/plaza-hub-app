import { describe, expect, it } from "vitest";
import { AccessDenied, assertOrganizationAccess, assertManageableMember, assertInvitationRecipient, parseIdentityCommand } from "@/modules/identity/policy";
import { identityConfig, sameOriginRequest } from "@/modules/identity/config";

const owner = { userId: "owner-a", organizationId: "org-a", role: "owner", revokedAt: null };
const request = { userId: owner.userId, organizationId: "org-a", resourceOrganizationId: "org-a", membership: owner, action: "organization:read" };
describe("AUTH-002/003 deny by default (policy tests, not database proof)", () => {
  it("rejects anonymous and missing membership", () => {
    expect(() => assertOrganizationAccess({ ...request, userId: null })).toThrow(AccessDenied);
    expect(() => assertOrganizationAccess({ ...request, membership: null })).toThrow(AccessDenied);
  });
  it("rejects foreign organization and resource selectors", () => {
    expect(() => assertOrganizationAccess({ ...request, organizationId: "org-b" })).toThrow(AccessDenied);
    expect(() => assertOrganizationAccess({ ...request, resourceOrganizationId: "org-b" })).toThrow(AccessDenied);
  });
  it("rejects revoked membership and another user's grant", () => {
    expect(() => assertOrganizationAccess({ ...request, membership: { ...owner, revokedAt: new Date() } })).toThrow(AccessDenied);
    expect(() => assertOrganizationAccess({ ...request, userId: "another-user" })).toThrow(AccessDenied);
  });
  it.each(["manager", "accountant"])("%s can read its organization but cannot administer staff", (role) => {
    const input = { ...request, membership: { ...owner, role } };
    expect(() => assertOrganizationAccess(input)).not.toThrow();
    for (const action of ["members:read", "members:manage", "invitations:manage"]) expect(() => assertOrganizationAccess({ ...input, action })).toThrow(AccessDenied);
  });
  it("owner permissions stay in the granted organization", () => {
    expect(() => assertOrganizationAccess({ ...request, action: "members:manage" })).not.toThrow();
    expect(() => assertOrganizationAccess({ ...request, organizationId: "org-b", action: "members:manage" })).toThrow(AccessDenied);
  });
  it.each(["admin", "platform-admin", "owner,manager", "tenant", "unknown"])("does not grant implicit privileges to %s", (role) => {
    expect(() => assertOrganizationAccess({ ...request, membership: { ...owner, role } })).toThrow(AccessDenied);
  });
  it("denies unimplemented resource scopes even to owners", () => {
    for (const action of ["invoices:read", "plazas:read", "tenant:read", "files:download", "unknown"]) expect(() => assertOrganizationAccess({ ...request, action })).toThrow(AccessDenied);
    expect(() => assertOrganizationAccess({ ...request, plazaId: "plaza-a" })).toThrow(AccessDenied);
    expect(() => assertOrganizationAccess({ ...request, tenantResourceId: "tenant-a" })).toThrow(AccessDenied);
  });
  it("rejects self promotion, owner changes and revoked target changes", () => {
    const manager = { ...owner, userId: "staff-a", role: "manager" };
    expect(() => assertManageableMember("staff-a", manager, "accountant")).toThrow(AccessDenied);
    expect(() => assertManageableMember(owner.userId, manager, "owner")).toThrow(AccessDenied);
    expect(() => assertManageableMember("other-owner", owner)).toThrow(AccessDenied);
    expect(() => assertManageableMember(owner.userId, { ...manager, revokedAt: new Date() })).toThrow(AccessDenied);
  });
  it("rejects malicious action/role/selector shapes", () => {
    for (const value of [null, [], { action: "role", organizationId: "org-a", memberId: "staff-a", role: "owner" }, { action: "switch", organizationId: "../org-b" }, { action: "create", organizationId: "org-a" }]) expect(() => parseIdentityCommand(value)).toThrow(AccessDenied);
    expect(parseIdentityCommand({ action: "switch", organizationId: "org-a", role: "owner" })).toEqual({ action: "switch", organizationId: "org-a" });
  });
});

describe("AUTH-004 invitation recipient boundary", () => {
  const now = new Date("2026-11-13T12:00:00Z");
  const invitation = { email: "recipient@example.test", status: "pending", expiresAt: new Date(now.getTime() + 60000), role: "manager" };
  const user = { email: invitation.email, emailVerified: true };
  it("requires the verified intended recipient", () => {
    expect(() => assertInvitationRecipient(invitation, user, now)).not.toThrow();
    expect(() => assertInvitationRecipient(invitation, { ...user, email: "someone@example.test" }, now)).toThrow(AccessDenied);
    expect(() => assertInvitationRecipient(invitation, { ...user, emailVerified: false }, now)).toThrow(AccessDenied);
  });
  it.each(["accepted", "canceled", "rejected"])("rejects %s invitations", (status) => expect(() => assertInvitationRecipient({ ...invitation, status }, user, now)).toThrow(AccessDenied));
  it("rejects expiry at the exact boundary and privileged roles", () => {
    expect(() => assertInvitationRecipient({ ...invitation, expiresAt: now }, user, now)).toThrow(AccessDenied);
    expect(() => assertInvitationRecipient({ ...invitation, role: "owner" }, user, now)).toThrow(AccessDenied);
  });
});

describe("Local identity configuration and request origin", () => {
  const env = { NODE_ENV: "test", PLAZAHUB_AUTH_MODE: "local", DATABASE_URL: "postgresql://localhost/plazahub_test", BETTER_AUTH_URL: "http://127.0.0.1:3000", BETTER_AUTH_SECRET: "unit-test-only-not-a-real-secret-value" } satisfies NodeJS.ProcessEnv;
  it("requires explicit local configuration and a secret", () => {
    expect(() => identityConfig({ NODE_ENV: "test" })).toThrow();
    expect(() => identityConfig({ ...env, BETTER_AUTH_SECRET: "short" })).toThrow();
    expect(identityConfig(env).baseURL).toBe(env.BETTER_AUTH_URL);
  });
  it("closes production and remote database/base URLs", () => {
    expect(() => identityConfig({ ...env, NODE_ENV: "production" })).toThrow();
    expect(() => identityConfig({ ...env, DATABASE_URL: "postgresql://remote.example/db" })).toThrow();
    expect(() => identityConfig({ ...env, BETTER_AUTH_URL: "https://public.example" })).toThrow();
  });
  it("requires an exact origin, rejecting absent and hostile origins", () => {
    const url = `${env.BETTER_AUTH_URL}/api/identity`;
    expect(sameOriginRequest(new Request(url, { headers: { origin: env.BETTER_AUTH_URL } }), env.BETTER_AUTH_URL)).toBe(true);
    expect(sameOriginRequest(new Request(url), env.BETTER_AUTH_URL)).toBe(false);
    expect(sameOriginRequest(new Request(url, { headers: { origin: "https://evil.example" } }), env.BETTER_AUTH_URL)).toBe(false);
  });
});
