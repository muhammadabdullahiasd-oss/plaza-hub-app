export const staffRoles = ["owner", "manager", "accountant"] as const;
export type StaffRole = typeof staffRoles[number];
export type IdentityAction = "organization:read" | "members:read" | "members:manage" | "invitations:manage";
export type Membership = { userId: string; organizationId: string; role: string; revokedAt: Date | null };

export class AccessDenied extends Error {
  constructor() { super("Access is not available."); }
}

export function isStaffRole(role: string): role is StaffRole {
  return staffRoles.some((candidate) => candidate === role);
}

/** No platform bypass. Unimplemented plaza/tenant/financial actions deny. */
export function assertOrganizationAccess(input: {
  userId: string | null; organizationId: string; resourceOrganizationId: string;
  membership: Membership | null; action: string; plazaId?: string; tenantResourceId?: string;
}) {
  const { membership, userId, organizationId, resourceOrganizationId, action } = input;
  if (!userId || !membership || membership.userId !== userId || membership.organizationId !== organizationId || resourceOrganizationId !== organizationId || membership.revokedAt || !isStaffRole(membership.role) || input.plazaId !== undefined || input.tenantResourceId !== undefined) throw new AccessDenied();
  if (action === "organization:read") return;
  if (membership.role === "owner" && ["members:read", "members:manage", "invitations:manage"].includes(action)) return;
  throw new AccessDenied();
}

export function assertManageableMember(actorId: string, target: Membership, nextRole?: string) {
  // Owner transfer/revocation awaits a separately approved continuity policy.
  if (target.userId === actorId || target.role === "owner" || target.revokedAt || (nextRole !== undefined && nextRole !== "manager" && nextRole !== "accountant")) throw new AccessDenied();
}

export function assertInvitationRecipient(invitation: { email: string; status: string; expiresAt: Date; role: string | null }, user: { email: string; emailVerified: boolean }, now = new Date()) {
  if (!user.emailVerified || invitation.email.toLowerCase() !== user.email.toLowerCase() || invitation.status !== "pending" || invitation.expiresAt <= now || !["manager", "accountant"].includes(invitation.role ?? "")) throw new AccessDenied();
}

export function parseIdentityCommand(value: unknown):
  | { action: "switch"; organizationId: string }
  | { action: "revoke"; organizationId: string; memberId: string }
  | { action: "role"; organizationId: string; memberId: string; role: "manager" | "accountant" } {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new AccessDenied();
  const input = value as Record<string, unknown>;
  const validId = (id: unknown): id is string => typeof id === "string" && /^[a-zA-Z0-9_-]{1,128}$/.test(id);
  if (!validId(input.organizationId)) throw new AccessDenied();
  if (input.action === "switch") return { action: "switch", organizationId: input.organizationId };
  if (!validId(input.memberId)) throw new AccessDenied();
  if (input.action === "revoke") return { action: "revoke", organizationId: input.organizationId, memberId: input.memberId };
  if (input.action === "role" && (input.role === "manager" || input.role === "accountant")) return { action: "role", organizationId: input.organizationId, memberId: input.memberId, role: input.role };
  throw new AccessDenied();
}
