import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlazaIllustration } from "@/components/foundation/plaza-illustration";

const experiences = [
  { href: "/preview/staff", title: "For owners & staff", detail: "A workspace being prepared for the people who keep a plaza running.", label: "Explore staff preview", number: "01" },
  { href: "/tenant", title: "For shop tenants", detail: "A simple, mobile-first home for your shop information, when account access is ready.", label: "Explore tenant preview", number: "02" },
  { href: "/preview/platform", title: "For platform operators", detail: "A separate space for platform administration. Provisioning is not available yet.", label: "Explore platform preview", number: "03" },
] as const;

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="page-container grid items-center gap-12 py-14 md:grid-cols-2 md:py-24" aria-labelledby="hero-title">
        <div className="min-w-0">
          <p className="mb-6 inline-flex rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">Nigeria-first · Foundation preview</p>
          <h1 id="hero-title" className="max-w-xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">A clearer view<br />of your <span className="text-accent">plaza.</span></h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">One considered workspace for plaza owners, the teams who manage them, and the businesses that call them home.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="teal"><Link href="/preview/staff">Explore staff preview <span aria-hidden="true">→</span></Link></Button>
            <Button asChild variant="outline"><Link href="/tenant">View tenant preview</Link></Button>
          </div>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">Explore the public previews. Staff account access is being verified before release.</p>
        </div>
        <PlazaIllustration />
      </section>
      <section className="border-y bg-card py-12 sm:py-16" aria-labelledby="experiences-title">
        <div className="page-container">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Designed around people</p>
          <h2 id="experiences-title" className="mt-3 text-3xl font-bold tracking-tight">Different roles. One shared place.</h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">Explore the public previews below. They show the spaces we are preparing, without sample accounts or financial records.</p>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {experiences.map((experience) => (
              <Card key={experience.href} className="flex flex-col bg-background">
                <CardHeader>
                  <span className="text-sm font-semibold tracking-widest text-accent" aria-hidden="true">{experience.number}</span>
                  <h3 className="text-xl font-semibold">{experience.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{experience.detail}</p>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Link href={experience.href} className="inline-flex min-h-11 items-center rounded-md text-sm font-semibold underline decoration-border underline-offset-4 hover:text-accent">{experience.label} <span aria-hidden="true" className="ml-2">↗</span></Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="page-container py-12 sm:py-16" aria-labelledby="purpose-title">
        <div className="grid gap-5 rounded-2xl bg-primary p-7 text-primary-foreground sm:p-10 md:grid-cols-2 md:gap-12">
          <h2 id="purpose-title" className="text-2xl font-semibold leading-snug">Built for busy plazas.<br />Made to feel straightforward.</h2>
          <p className="leading-7 text-slate-200">PlazaHub starts with clear navigation and a tenant experience designed for small screens. Account access and operational tools will follow in separately reviewed releases.</p>
        </div>
      </section>
    </main>
  );
}
