import { requireIdentity } from "@/modules/identity/pages";
import { workspace } from "@/modules/identity/service";
import { MemberControls, OrganizationSelector, SignOut } from "@/components/identity/workspace-controls";
import { MfaEnrollment } from "@/components/identity/mfa-enrollment";
export default async function StaffPage() {
  const identity = await requireIdentity();
  const data = await workspace(identity).catch(() => null);
  if (!data) return <div className="space-y-5"><h1 className="text-3xl font-bold">Workspace unavailable</h1><p>Your access could not be confirmed. Sign in again or contact your organization owner.</p><SignOut /></div>;
  const active = data.active;
  return <div className="space-y-8">
    <header className="flex flex-wrap items-start justify-between gap-5"><div className="min-w-0 space-y-2"><h1 className="text-3xl font-bold">Staff account</h1><p className="break-words">{data.user.name} · {data.user.email}</p><p className="text-sm text-muted-foreground">Session expires <time dateTime={data.expiresAt}>{new Date(data.expiresAt).toLocaleString("en-NG", { timeZone: "Africa/Lagos" })} (Lagos)</time>.</p></div><SignOut /></header>
    <section className="space-y-4" aria-labelledby="org-title"><h2 id="org-title" className="text-xl font-semibold">Your organizations</h2>
      {data.organizations.length ? <OrganizationSelector organizations={data.organizations} activeId={active?.id} /> : <p>No active organization membership. Contact your organization owner.</p>}
      {active && <div className="rounded-lg border bg-card p-5"><h3 className="break-words text-lg font-semibold">{active.name}</h3><p>Your role: {active.role}</p><p className="mt-2 text-sm text-muted-foreground">Operational records are not implemented in this workspace.</p></div>}
    </section>
    {active?.role === "owner" && <section className="space-y-4" aria-labelledby="members-title"><h2 id="members-title" className="text-xl font-semibold">Staff members</h2><ul className="space-y-4">{data.members.map((member) => <li key={member.id} className="space-y-3 rounded-lg border bg-card p-5"><h3 className="break-words font-semibold">{member.name}</h3><p className="break-words text-sm">{member.email}</p><p className="text-sm">{member.role} · {member.revoked ? "Revoked" : "Active"}</p>{!member.revoked && member.role !== "owner" && member.userId !== data.user.id && <MemberControls organizationId={active.id} memberId={member.id} role={member.role} />}</li>)}</ul><p className="text-sm leading-6 text-muted-foreground">Invitations are unavailable until secure email delivery and recipient verification are configured. Owner transfer and removal are not enabled.</p></section>}
    <section className="space-y-4 border-t pt-6" aria-labelledby="security-title"><h2 id="security-title" className="text-xl font-semibold">Account security</h2><MfaEnrollment enabled={Boolean(data.user.twoFactorEnabled)} /></section>
  </div>;
}
