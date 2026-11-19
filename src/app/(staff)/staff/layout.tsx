import type { ReactNode } from "react";
import { requireIdentity } from "@/modules/identity/pages";
export const dynamic = "force-dynamic";
export default async function StaffLayout({ children }: { children: ReactNode }) {
  await requireIdentity();
  return <main id="main-content" tabIndex={-1} className="page-container py-10"><div className="mx-auto max-w-4xl">{children}</div></main>;
}
