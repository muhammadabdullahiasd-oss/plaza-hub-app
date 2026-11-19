import "server-only";
import { getPrisma } from "@/lib/db/client";
import { Prisma } from "@/generated/prisma/client";
import { getAuth } from "./auth";
import { identityAvailable } from "./config";
import { AccessDenied, assertInvitationRecipient, assertManageableMember, assertOrganizationAccess, isStaffRole, parseIdentityCommand } from "./policy";

export async function currentSession(headers: Headers) {
  if (!identityAvailable() || !headers.get("cookie")) return null;
  return getAuth().api.getSession({ headers, query: { disableCookieCache: true } });
}

type Authenticated = NonNullable<Awaited<ReturnType<typeof currentSession>>>;

async function liveSession(tx: Prisma.TransactionClient, identity: Authenticated) {
  const session = await tx.session.findFirst({ where: { id: identity.session.id, userId: identity.user.id, expiresAt: { gt: new Date() } } });
  if (!session) throw new AccessDenied();
  return session;
}

export async function workspace(identity: Authenticated) {
  return getPrisma().$transaction(async (tx) => {
    const session = await liveSession(tx, identity);
    const memberships = await tx.member.findMany({
      where: { userId: identity.user.id, revokedAt: null, role: { in: ["owner", "manager", "accountant"] } },
      select: { id: true, role: true, organizationId: true, userId: true, revokedAt: true, organization: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: "asc" },
    });
    const active = memberships.find((member) => member.organizationId === session.activeOrganizationId) ?? null;
    if (active) assertOrganizationAccess({ userId: identity.user.id, organizationId: active.organizationId, resourceOrganizationId: active.organization.id, membership: active, action: "organization:read" });
    const members = active?.role === "owner" ? await tx.member.findMany({
      where: { organizationId: active.organizationId },
      select: { id: true, userId: true, role: true, revokedAt: true, user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    }) : [];
    return {
      user: { id: identity.user.id, name: identity.user.name, email: identity.user.email, twoFactorEnabled: identity.user.twoFactorEnabled },
      expiresAt: session.expiresAt.toISOString(),
      organizations: memberships.map((member) => ({ ...member.organization, role: member.role })),
      active: active ? { ...active.organization, role: active.role } : null,
      members: members.map((member) => ({ id: member.id, userId: member.userId, role: member.role, revoked: member.revokedAt !== null, name: member.user.name, email: member.user.email })),
    };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });
}

/** Every mutation rechecks the live session and membership inside its transaction. */
export async function changeWorkspace(identity: Authenticated, value: unknown) {
  const command = parseIdentityCommand(value);
  return getPrisma().$transaction(async (tx) => {
    const session = await liveSession(tx, identity);
    const actor = await tx.member.findUnique({ where: { organizationId_userId: { organizationId: command.organizationId, userId: identity.user.id } } });
    assertOrganizationAccess({ userId: identity.user.id, organizationId: command.organizationId, resourceOrganizationId: command.organizationId, membership: actor, action: command.action === "switch" ? "organization:read" : "members:manage" });
    if (command.action === "switch") {
      await tx.session.update({ where: { id: session.id }, data: { activeOrganizationId: command.organizationId } });
      return;
    }
    const target = await tx.member.findFirst({ where: { id: command.memberId, organizationId: command.organizationId } });
    if (!target) throw new AccessDenied();
    assertManageableMember(identity.user.id, target, command.action === "role" ? command.role : undefined);
    if (command.action === "revoke") {
      await tx.member.update({ where: { id: target.id }, data: { revokedAt: new Date() } });
      await tx.session.updateMany({ where: { userId: target.userId, activeOrganizationId: command.organizationId }, data: { activeOrganizationId: null } });
    } else {
      if (!isStaffRole(target.role)) throw new AccessDenied();
      await tx.member.update({ where: { id: target.id }, data: { role: command.role } });
    }
    await tx.identityAuditEvent.create({ data: {
      organizationId: command.organizationId, actorId: identity.user.id,
      action: command.action === "revoke" ? "membership.revoked" : "membership.role_changed",
      targetId: target.id, previousRole: target.role, nextRole: command.action === "role" ? command.role : null,
    } });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export async function platformAccess(identity: Authenticated) {
  return getPrisma().$transaction(async (tx) => {
    await liveSession(tx, identity);
    const user = await tx.user.findUnique({ where: { id: identity.user.id }, select: { platformRole: true } });
    return user?.platformRole === "admin";
  });
}

/** Prepared persistence boundary; no public invitation route/delivery is enabled. */
export async function acceptStaffInvitation(identity: Authenticated, invitationId: string) {
  return getPrisma().$transaction(async (tx) => {
    await liveSession(tx, identity);
    const user = await tx.user.findUnique({ where: { id: identity.user.id } });
    if (!user) throw new AccessDenied();
    const invitation = await tx.invitation.findFirst({ where: { id: invitationId, email: user.email } });
    if (!invitation) throw new AccessDenied();
    assertInvitationRecipient(invitation, user);
    const inviter = await tx.member.findUnique({ where: { organizationId_userId: { organizationId: invitation.organizationId, userId: invitation.inviterId } } });
    assertOrganizationAccess({ userId: invitation.inviterId, organizationId: invitation.organizationId, resourceOrganizationId: invitation.organizationId, membership: inviter, action: "invitations:manage" });
    const existing = await tx.member.findUnique({ where: { organizationId_userId: { organizationId: invitation.organizationId, userId: user.id } } });
    if (existing || !invitation.role) throw new AccessDenied();
    const member = await tx.member.create({ data: { id: crypto.randomUUID(), organizationId: invitation.organizationId, userId: user.id, role: invitation.role } });
    await tx.invitation.update({ where: { id: invitation.id }, data: { status: "accepted" } });
    await tx.identityAuditEvent.create({ data: { organizationId: invitation.organizationId, actorId: user.id, action: "invitation.accepted", targetId: member.id, nextRole: member.role } });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export async function cancelStaffInvitation(identity: Authenticated, organizationId: string, invitationId: string) {
  return getPrisma().$transaction(async (tx) => {
    await liveSession(tx, identity);
    const membership = await tx.member.findUnique({ where: { organizationId_userId: { organizationId, userId: identity.user.id } } });
    assertOrganizationAccess({ userId: identity.user.id, organizationId, resourceOrganizationId: organizationId, membership, action: "invitations:manage" });
    const invitation = await tx.invitation.findFirst({ where: { id: invitationId, organizationId, status: "pending" } });
    if (!invitation) throw new AccessDenied();
    await tx.invitation.update({ where: { id: invitation.id }, data: { status: "canceled" } });
    await tx.identityAuditEvent.create({ data: { organizationId, actorId: identity.user.id, action: "invitation.canceled", targetId: invitation.id } });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}
