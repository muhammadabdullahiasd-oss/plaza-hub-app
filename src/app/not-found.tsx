import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="page-container space-y-6 py-20">
      <p className="text-sm font-semibold text-accent">Page not found</p>
      <h1 className="text-3xl font-bold">That space is not here yet.</h1>
      <p className="max-w-lg leading-7 text-muted-foreground">Return to the PlazaHub preview to explore the available pages.</p>
      <Button asChild><Link href="/">Back to PlazaHub</Link></Button>
    </main>
  );
}
