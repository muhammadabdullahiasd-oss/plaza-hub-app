import Link from "next/link";
import { Brand } from "./brand";

export function SiteHeader() {
  return (
    <header className="border-b bg-card">
      <div className="page-container flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-4">
        <Brand />
        <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground sm:hidden">Preview</span>
        <nav aria-label="Main navigation" className="flex w-full flex-wrap items-center gap-x-5 sm:w-auto">
          <Link className="inline-flex min-h-11 items-center rounded-md text-sm font-medium hover:text-accent" href="/preview/staff">Staff preview</Link>
          <Link className="inline-flex min-h-11 items-center rounded-md text-sm font-medium hover:text-accent" href="/tenant">Tenant preview</Link>
          <Link className="inline-flex min-h-11 items-center rounded-md text-sm font-medium text-muted-foreground hover:text-accent" href="/preview/platform">Platform preview</Link>
          <Link className="inline-flex min-h-11 items-center rounded-md text-sm font-medium hover:text-accent" href="/sign-in">Staff sign-in</Link>
        </nav>
      </div>
    </header>
  );
}
