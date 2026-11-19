import type { ReactNode } from "react";
import { requireIdentity } from "@/modules/identity/pages";
import { platformAccess } from "@/modules/identity/service";
import { SignOut } from "@/components/identity/workspace-controls";
export const dynamic = "force-dynamic";
export default async function PlatformLayout({ children }: { children: ReactNode }) {
  const identity = await requireIdentity();
  const allowed = await platformAccess(identity).catch(() => false);
  return <main id="main-content" tabIndex={-1} className="page-container py-10"><div className="mx-auto max-w-4xl space-y-6">{allowed ? children : <><h1 className="text-3xl font-bold">Access unavailable</h1><p>This account does not have platform administration access.</p></>}<SignOut /></div></main>;
}
