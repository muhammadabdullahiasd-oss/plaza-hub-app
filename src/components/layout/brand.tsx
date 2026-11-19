import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" aria-label="PlazaHub home" className="inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-md">
      <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
        <rect width="36" height="36" rx="9" fill="#142c40" />
        <path d="M10 26V10h16v16h-5V15h-6v11Z" fill="#77d3bf" />
      </svg>
      <span className="text-xl font-bold tracking-tight">Plaza<span className="text-accent">Hub</span></span>
    </Link>
  );
}
