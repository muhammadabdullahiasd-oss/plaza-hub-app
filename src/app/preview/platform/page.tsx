import type { Metadata } from "next";
import { PreviewNotice } from "@/components/foundation/preview-notice";
import { ComingLater } from "@/components/foundation/coming-later";

export const metadata: Metadata = { title: "Platform preview" };

export default function PlatformPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-2xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Platform operators</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">A separate home for platform administration.</h1>
        <p className="leading-7 text-muted-foreground">The platform area is being prepared. Customer provisioning and support actions are not available in this preview.</p>
      </header>
      <PreviewNotice />
      <section aria-labelledby="platform-planned" className="space-y-4">
        <h2 id="platform-planned" className="text-xl font-semibold">Planned platform areas</h2>
        <ComingLater items={["Organization provisioning", "Platform support"]} />
        <p className="text-sm leading-6 text-muted-foreground">Platform administration does not provide routine access to customer financial records.</p>
      </section>
    </div>
  );
}
