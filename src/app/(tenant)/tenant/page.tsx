import type { Metadata } from "next";
import { PreviewNotice } from "@/components/foundation/preview-notice";
import { ComingLater } from "@/components/foundation/coming-later";

export const metadata: Metadata = { title: "Tenant preview" };

export default function TenantPage() {
  return (
    <div className="space-y-7">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">For shop tenants</p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Your shop, closer at hand.</h1>
        <p className="leading-7 text-muted-foreground">A simple space designed for your phone. Explore the layout while we prepare secure account access.</p>
      </header>
      <PreviewNotice />
      <section aria-labelledby="tenant-planned" className="space-y-4">
        <h2 id="tenant-planned" className="text-xl font-semibold">What will belong here</h2>
        <ComingLater items={["My shop", "Bills", "Payments and receipts", "Account"]} />
      </section>
      <aside className="rounded-xl border border-dashed p-5 text-sm leading-6 text-muted-foreground" aria-label="Connectivity information">
        <p className="font-semibold text-foreground">Browser-first, mobile-friendly</p>
        <p className="mt-1">No installation is needed to explore this preview. Offline access and notifications are not available.</p>
      </aside>
    </div>
  );
}
