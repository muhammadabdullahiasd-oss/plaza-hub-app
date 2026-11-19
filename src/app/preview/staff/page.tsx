import type { Metadata } from "next";
import { PreviewNotice } from "@/components/foundation/preview-notice";
import { ComingLater } from "@/components/foundation/coming-later";

export const metadata: Metadata = { title: "Staff preview" };

export default function StaffPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-2xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Owners · Managers · Accountants</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your plaza workspace, taking shape.</h1>
        <p className="leading-7 text-muted-foreground">A dedicated space for the people managing day-to-day plaza operations. This foundation preview has no connected accounts.</p>
      </header>
      <PreviewNotice />
      <section aria-labelledby="staff-planned" className="space-y-4">
        <h2 id="staff-planned" className="text-xl font-semibold">Planned workspace areas</h2>
        <ComingLater items={["Plazas and shops", "Tenant and lease records", "Billing and payment records", "Expenses and reports"]} />
      </section>
    </div>
  );
}
