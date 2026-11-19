"use client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { identityPost, inputClass } from "./request";

export function SignOut() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function signOut() {
    setPending(true); setError("");
    try { await identityPost("/api/auth/sign-out", {}); window.location.replace("/sign-in"); }
    catch { setError("Sign-out could not be confirmed. Try again."); setPending(false); }
  }
  return <div><Button variant="outline" onClick={signOut} disabled={pending}>{pending ? "Signing out…" : "Sign out"}</Button><p role="alert">{error}</p></div>;
}

export function OrganizationSelector({ organizations, activeId }: { organizations: { id: string; name: string; role: string }[]; activeId?: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const organizationId = new FormData(event.currentTarget).get("organizationId");
    setPending(true); setError("");
    try { await identityPost("/api/identity", { action: "switch", organizationId }); window.location.replace("/staff"); }
    catch (error) { setError(error instanceof Error ? error.message : "Unable to switch organization."); setPending(false); }
  }
  return <form onSubmit={submit} className="max-w-lg space-y-3"><label className="block font-medium" htmlFor="organization">Organization<select id="organization" name="organizationId" defaultValue={activeId ?? ""} required className={inputClass}><option value="" disabled>Select an organization</option>{organizations.map((org) => <option key={org.id} value={org.id}>{org.name} ({org.role})</option>)}</select></label><Button disabled={pending || !organizations.length} type="submit">{pending ? "Switching…" : "Use organization"}</Button><p role="alert">{error}</p></form>;
}

export function MemberControls({ organizationId, memberId, role }: { organizationId: string; memberId: string; role: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function change(action: "role" | "revoke", nextRole?: FormDataEntryValue | null) {
    setPending(true); setError("");
    try { await identityPost("/api/identity", { action, organizationId, memberId, role: nextRole }); window.location.replace("/staff"); }
    catch (error) { setError(error instanceof Error ? error.message : "Unable to update membership."); setPending(false); }
  }
  return <div className="space-y-3"><form className="flex flex-wrap items-end gap-3" onSubmit={(event) => { event.preventDefault(); void change("role", new FormData(event.currentTarget).get("role")); }}><label className="block text-sm" htmlFor={`role-${memberId}`}>Staff role<select id={`role-${memberId}`} name="role" defaultValue={role} className={inputClass}><option value="manager">Manager</option><option value="accountant">Accountant</option></select></label><Button type="submit" variant="outline" disabled={pending}>Save role</Button></form><details><summary className="cursor-pointer py-3 text-sm underline">Revoke this membership</summary><p className="mb-3 text-sm">This person will lose access to this organization on their next request.</p><Button disabled={pending} variant="outline" onClick={() => void change("revoke")}>Confirm revocation</Button></details><p role="alert">{error}</p></div>;
}
