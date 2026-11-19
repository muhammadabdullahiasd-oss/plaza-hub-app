import { randomUUID, randomBytes } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { hashPassword } from "better-auth/crypto";
import { getPrisma, disconnectPrisma } from "@/lib/db/client";
import { authenticationRequest, identityRequest } from "@/modules/identity/http";
import { currentSession, changeWorkspace, workspace, platformAccess, acceptStaffInvitation, cancelStaffInvitation } from "@/modules/identity/service";
import { AccessDenied } from "@/modules/identity/policy";

// Real, isolated PostgreSQL fixtures only; configuration refuses missing/remote DBs.
const db = getPrisma();
const origin = "http://127.0.0.1:3101";
const orgA = randomUUID(); const orgB = randomUUID();
const ownerId = randomUUID(); const managerId = randomUUID(); const outsiderId = randomUUID(); const platformId = randomUUID();
const managerMemberId = randomUUID(); const inviteId = randomUUID();
const password = randomBytes(24).toString("base64url");
const email = (id: string) => `${id}@identity.example.test`;
let ownerCookie = ""; let managerCookie = ""; let outsiderCookie = ""; let platformCookie = "";
const header = (cookie: string) => new Headers({ cookie, origin });
const post = (path: string, body: object, cookie = "") => new Request(`${origin}${path}`, { method: "POST", headers: { origin, cookie, "Content-Type": "application/json" }, body: JSON.stringify(body) });
async function signIn(id: string) {
  const response = await authenticationRequest(post("/api/auth/sign-in/email", { email: email(id), password }));
  expect(response.status).toBe(200);
  const cookies = response.headers.getSetCookie();
  expect(cookies.some((cookie) => cookie.includes("HttpOnly") && cookie.includes("SameSite=Lax"))).toBe(true);
  const payload = await response.json();
  expect(payload).not.toHaveProperty("token");
  return cookies.map((cookie) => cookie.split(";")[0]).join("; ");
}
async function identity(cookie: string) {
  const value = await currentSession(header(cookie));
  if (!value) throw new Error("Expected fixture session.");
  return value;
}

beforeAll(async () => {
  const digest = await hashPassword(password);
  await db.$transaction(async (tx) => {
    for (const id of [ownerId, managerId, outsiderId, platformId]) {
      await tx.user.create({ data: { id, name: "Integration fixture", email: email(id), emailVerified: true, platformRole: id === platformId ? "admin" : null } });
      await tx.account.create({ data: { id: randomUUID(), userId: id, accountId: id, providerId: "credential", password: digest } });
    }
    for (const id of [orgA, orgB]) await tx.organization.create({ data: { id, name: `Fixture ${id}`, slug: id } });
    await tx.member.createMany({ data: [
      { id: randomUUID(), organizationId: orgA, userId: ownerId, role: "owner" },
      { id: randomUUID(), organizationId: orgB, userId: ownerId, role: "accountant" },
      { id: managerMemberId, organizationId: orgA, userId: managerId, role: "manager" },
    ] });
    await tx.invitation.create({ data: { id: inviteId, organizationId: orgA, email: email(outsiderId), role: "manager", inviterId: ownerId, expiresAt: new Date(Date.now() + 600000) } });
  });
  ownerCookie = await signIn(ownerId); managerCookie = await signIn(managerId);
  outsiderCookie = await signIn(outsiderId); platformCookie = await signIn(platformId);
});

afterAll(async () => {
  // Exact fixture IDs only: no truncate, reset, broad deletion or existing data reuse.
  await db.$transaction(async (tx) => {
    await tx.identityAuditEvent.deleteMany({ where: { organizationId: { in: [orgA, orgB] } } });
    await tx.invitation.deleteMany({ where: { organizationId: { in: [orgA, orgB] } } });
    await tx.member.deleteMany({ where: { organizationId: { in: [orgA, orgB] } } });
    await tx.organization.deleteMany({ where: { id: { in: [orgA, orgB] } } });
    await tx.user.deleteMany({ where: { id: { in: [ownerId, managerId, outsiderId, platformId] } } });
  });
  await disconnectPrisma();
});

describe.sequential("AUTH-001–004 / AUD-001 real PostgreSQL", () => {
  it("rejects anonymous protected reads", async () => {
    const response = await identityRequest(new Request(`${origin}/api/identity`));
    expect(response.status).toBe(401);
    expect(await response.text()).not.toContain(orgA);
  });
  it("valid password creates a server-backed session without exposing its token", async () => {
    const session = await identity(ownerCookie);
    expect(session.user.id).toBe(ownerId);
    expect(session.session.expiresAt.getTime() - Date.now()).toBeLessThanOrEqual(8 * 60 * 60 * 1000);
    expect(session.session.expiresAt.getTime() - Date.now()).toBeGreaterThan(7 * 60 * 60 * 1000);
    expect(await db.session.findUnique({ where: { id: session.session.id } })).not.toBeNull();
  });
  it("reads only the user's organization list and never merges grants", async () => {
    const data = await workspace(await identity(managerCookie));
    expect(data.organizations.map((org) => org.id)).toEqual([orgA]);
    const owner = await identity(ownerCookie);
    await changeWorkspace(owner, { action: "switch", organizationId: orgB });
    const view = await workspace(owner);
    expect(view.active?.role).toBe("accountant");
    expect(view.members).toEqual([]);
  });
  it("requires real membership when switching organizations", async () => {
    await expect(changeWorkspace(await identity(managerCookie), { action: "switch", organizationId: orgB })).rejects.toThrow(AccessDenied);
  });
  it("rejects a foreign member ID without disclosing or modifying it", async () => {
    const foreign = await db.member.findUniqueOrThrow({ where: { organizationId_userId: { organizationId: orgB, userId: ownerId } } });
    const before = await db.identityAuditEvent.count({ where: { organizationId: orgA } });
    const response = await identityRequest(post("/api/identity", { action: "role", organizationId: orgA, memberId: foreign.id, role: "manager" }, ownerCookie));
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "Access is not available." });
    expect((await db.member.findUniqueOrThrow({ where: { id: foreign.id } })).role).toBe("accountant");
    expect(await db.identityAuditEvent.count({ where: { organizationId: orgA } })).toBe(before);
  });
  it("rejects manager escalation through modified request parameters", async () => {
    const manager = await identity(managerCookie);
    await expect(changeWorkspace(manager, { action: "role", organizationId: orgA, memberId: managerMemberId, role: "owner" })).rejects.toThrow(AccessDenied);
    await expect(changeWorkspace(manager, { action: "role", organizationId: orgA, memberId: managerMemberId, role: "accountant" })).rejects.toThrow(AccessDenied);
  });
  it("does not let a platform role bypass customer memberships", async () => {
    const admin = await identity(platformCookie);
    expect(await platformAccess(admin)).toBe(true);
    expect((await workspace(admin)).organizations).toEqual([]);
    await expect(changeWorkspace(admin, { action: "switch", organizationId: orgA })).rejects.toThrow(AccessDenied);
    expect(await platformAccess(await identity(ownerCookie))).toBe(false);
  });
  it("enforces membership uniqueness and foreign keys", async () => {
    await expect(db.member.create({ data: { id: randomUUID(), organizationId: orgA, userId: managerId, role: "manager" } })).rejects.toMatchObject({ code: "P2002" });
    await expect(db.member.create({ data: { id: randomUUID(), organizationId: randomUUID(), userId: managerId, role: "manager" } })).rejects.toMatchObject({ code: "P2003" });
  });
  it("persists an authorized role change and audit atomically", async () => {
    await changeWorkspace(await identity(ownerCookie), { action: "role", organizationId: orgA, memberId: managerMemberId, role: "accountant" });
    expect((await db.member.findUniqueOrThrow({ where: { id: managerMemberId } })).role).toBe("accountant");
    expect(await db.identityAuditEvent.count({ where: { organizationId: orgA, targetId: managerMemberId, action: "membership.role_changed", nextRole: "accountant" } })).toBe(1);
  });
  it("rejects invitations for a different or unverified recipient", async () => {
    await expect(acceptStaffInvitation(await identity(managerCookie), inviteId)).rejects.toThrow(AccessDenied);
    await db.user.update({ where: { id: outsiderId }, data: { emailVerified: false } });
    await expect(acceptStaffInvitation(await identity(outsiderCookie), inviteId)).rejects.toThrow(AccessDenied);
    await db.user.update({ where: { id: outsiderId }, data: { emailVerified: true } });
  });
  it("rejects expired, invalid and canceled invitations", async () => {
    const outsider = await identity(outsiderCookie);
    await expect(acceptStaffInvitation(outsider, randomUUID())).rejects.toThrow(AccessDenied);
    await db.invitation.update({ where: { id: inviteId }, data: { expiresAt: new Date(Date.now() - 1000) } });
    await expect(acceptStaffInvitation(outsider, inviteId)).rejects.toThrow(AccessDenied);
    await cancelStaffInvitation(await identity(ownerCookie), orgA, inviteId);
    await expect(acceptStaffInvitation(outsider, inviteId)).rejects.toThrow(AccessDenied);
  });
  it("accepts only the intended role once and audits acceptance", async () => {
    const id = randomUUID();
    await db.invitation.create({ data: { id, organizationId: orgA, email: email(outsiderId), role: "manager", inviterId: ownerId, expiresAt: new Date(Date.now() + 600000) } });
    const outsider = await identity(outsiderCookie);
    await acceptStaffInvitation(outsider, id);
    await expect(acceptStaffInvitation(outsider, id)).rejects.toThrow(AccessDenied);
    expect((await db.member.findUniqueOrThrow({ where: { organizationId_userId: { organizationId: orgA, userId: outsiderId } } })).role).toBe("manager");
    expect(await db.identityAuditEvent.count({ where: { organizationId: orgA, actorId: outsiderId, action: "invitation.accepted" } })).toBe(1);
  });
  it("revoking membership removes access on the next request", async () => {
    const manager = await identity(managerCookie);
    await changeWorkspace(manager, { action: "switch", organizationId: orgA });
    await changeWorkspace(await identity(ownerCookie), { action: "revoke", organizationId: orgA, memberId: managerMemberId });
    expect((await workspace(manager)).organizations).toEqual([]);
    await expect(changeWorkspace(manager, { action: "switch", organizationId: orgA })).rejects.toThrow(AccessDenied);
  });
  it("revoked and expired sessions cannot read workspace data", async () => {
    const manager = await identity(managerCookie);
    await db.session.update({ where: { id: manager.session.id }, data: { expiresAt: new Date(Date.now() - 1000) } });
    expect(await currentSession(header(managerCookie))).toBeNull();
    await expect(workspace(manager)).rejects.toThrow(AccessDenied);
    const owner = await identity(ownerCookie);
    const response = await authenticationRequest(post("/api/auth/sign-out", {}, ownerCookie));
    expect(response.status).toBe(200);
    expect(await currentSession(header(ownerCookie))).toBeNull();
    await expect(workspace(owner)).rejects.toThrow(AccessDenied);
  });
  it("rejects invalid credentials with a generic response and rate limits attempts", async () => {
    const statuses: number[] = [];
    for (let attempt = 0; attempt < 6; attempt++) {
      const response = await authenticationRequest(post("/api/auth/sign-in/email", { email: attempt % 2 ? email(ownerId) : "unknown@identity.example.test", password: "invalid-password" }));
      expect([401, 429]).toContain(response.status);
      expect(await response.text()).not.toContain(email(ownerId));
      statuses.push(response.status);
    }
    expect(statuses).toContain(429);
  });
});
