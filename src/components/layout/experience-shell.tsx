import Link from "next/link";
import type { ReactNode } from "react";

type ExperienceShellProps = { name: string; children: ReactNode; compact?: boolean };

/** Visual boundary only: these public previews contain no protected resources. */
export function ExperienceShell({ name, children, compact = false }: ExperienceShellProps) {
  return (
    <main id="main-content" tabIndex={-1} className="page-container py-8 sm:py-12">
      <div className={compact ? "mx-auto max-w-2xl" : "mx-auto max-w-5xl"}>
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-md underline underline-offset-4">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{name} preview</span>
        </nav>
        {children}
      </div>
    </main>
  );
}
