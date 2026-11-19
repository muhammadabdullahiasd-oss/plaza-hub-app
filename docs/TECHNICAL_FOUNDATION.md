# Task 004 technical foundation

**Task 005 architecture update, 2026-11-13:** The user authorized identity work while explicitly deferring the known Windows WebKit failures. `src/modules/identity` now owns Better Auth, organization membership checks and audited identity mutations; `/staff` and `/platform` are protected, with public previews at `/preview/staff` and `/preview/platform`. Ten identity models are prepared using Prisma 7.10.1 and Better Auth 1.7.22, with no applied migration or DB integration evidence. Production authentication is disabled pending MFA/recovery verification. [TASK005_STATUS](TASK005_STATUS.md) supersedes earlier no-auth/no-model statements for the current implementation. Product decision statuses remain unchanged; the Task 004 history below is preserved.

**Verification update, 2026-11-10:** The initial installation blocker described below is resolved. Installation, frozen lockfile, strict types, lint, unit/static tests, Prisma validation/generation and production build passed. Local responsive smoke and PWA manifest checks passed. Task 004 remains PARTIAL because Windows WebKit keyboard focus fails, including on minimal HTML. See [current evidence](TASK004_STATUS.md). The original 2026-11-05 record below is retained as history, not the current installed/test state. The browser matrix now has five cases across four projects (360/390/768/1280px), and `agentRules: false` prevents Next.js from automatically modifying the reviewed AGENTS.md. No business decisions changed.

Recorded 2026-11-05 under the supplied application-foundation brief. These are technical implementation choices, not changes to O/GAP decisions or founder/legal approval. Source is prepared; package installation and runtime compatibility are unverified.

## Structure and boundaries

```text
src/app/                    App Router, global layout/CSS, manifest, landing/404
  (platform)/platform/      Public platform preview layout and page
  (staff)/staff/            Public staff preview layout and page
  (tenant)/tenant/          Mobile-first public tenant preview
src/components/             Layout, source-owned shadcn-style UI, preview content
src/lib/db/                 Local URL guard and lazy server-only Prisma lifecycle
src/modules/README.md       Eleven future module responsibilities/dependencies
prisma/schema.prisma        PostgreSQL datasource + generator; no models
public/icons/               Original generated install assets
scripts/                    Icon generator and explicit local DB probe
tests/                      Node static checks, Vitest unit, Playwright E2E
.github/workflows/ci.yml     PR/manual verification, no deployment
```

Separate route layouts do not establish authorization. All content is public and clearly labeled unavailable. No speculative API routes, server actions, authentication, business service stubs or database records exist. Module directories will be added with real authorized implementation rather than empty files. Shared infrastructure is not a place for future business invariants.

## Tooling targets and official references

Actual environment: Node 24.15.0 and npm 11.12.1. pnpm and application dependencies are **not installed**. package.json declares Next/eslint-config-next 16.4.5, React/React DOM 19.2.6, pnpm 12.16.1, TypeScript ~5.9.3, Prisma/client/adapter ^7.0.0, Tailwind/PostCSS ^4.1.0, Vitest ^4.0.0 and Playwright ^1.58.0. All other ranges are recorded in package.json. Exact installed versions require a real lockfile; none is fabricated.

- App Router, src directory, strict TS, ESLint flat config and alias `@/*`: [Next installation](https://nextjs.org/docs/app/getting-started/installation). Next target checked against the [official package registry](https://registry.npmjs.org/next/latest) during this task.
- Tailwind v4 PostCSS and CSS-first tokens; source-owned Button/Card and components.json follow [shadcn manual installation](https://ui.shadcn.com/docs/installation/manual). No shadcn CLI execution is claimed.
- Prisma ESM, generated client output, config datasource URL and pg adapter follow [Prisma 7 upgrade guidance](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7). [Generate documentation](https://www.prisma.io/docs/cli/v7/generate) describes optional `--require-models`; no fake model is introduced merely to generate a client. Model-less generation still needs verification against installed packages.
- pnpm target checked against the [official package registry](https://registry.npmjs.org/pnpm/latest). pnpm 12 uses `allowBuilds`, not removed `onlyBuiltDependencies`; consult [build settings](https://github.com/pnpm/pnpm/blob/main/pnpm/docs/settings/build.md). Only named necessary lifecycle scripts are permitted; client generation is explicit.
- Manifest/App Router metadata follows [Next PWA guidance](https://nextjs.org/docs/app/guides/progressive-web-apps). A service worker is deliberately deferred until it can be exercised safely.

## UI and PWA

Navy #142c40, teal #14776b, neutral #f7f9fa, text #142c40/#52616c and border #d5dfe4 are technical realizations of the proposed navy/teal direction, not a new product policy. CSS uses system fonts, 44px primary interaction heights, visible focus rings, a skip link, semantic headings and reduced-motion handling. Tailwind default breakpoints support stacked mobile and wider multi-column content. Server components are the default; no unnecessary client state/hooks or external font fetch is added.

Manifest scope/start is /tenant, standalone display, en-NG, navy theme. Icons are original deterministic PNGs generated with Node, including a maskable safe-zone asset. Pixel dimensions, opacity and safe-zone placement passed static tests. No service worker/offline cache, push, payment sync or installability success is claimed. Future private responses/documents must remain uncached by default.

## Database safety

Prisma client creation is lazy and server-only, reused across development reloads. pg pool is bounded (5), with explicit connection/idle timeouts. The application never calls it in Task 004. Local URL guard accepts only loopback PostgreSQL and rejects query overrides. The separate SELECT 1 probe requires explicit execution and has not run. No production URL, credentials or connection is used. Optional Compose uses PostgreSQL 17 with loopback binding; its image/runtime is untested here.

No domain schema, migrations, seed or final data model exists. Existing conceptual constraints, UTC timestamps, Africa/Lagos business-date interpretation, exact money, financial transactions and isolation requirements remain in DATABASE_DESIGN/SRS for later authorized implementation.

## Verification and remaining work

Four dependency-free tests passed in-process. Eight Vitest cases and twelve configured Playwright cases (four per browser project) are authored but unrun. Browser projects include desktop Chromium, 360px Chromium and mobile WebKit. CI is configured to install browsers/system libraries and uses only a loopback placeholder DB URL; it cannot pass without the missing lockfile.

Resolve approved registry access, install dependencies, review actual resolved versions/build scripts, generate lockfile/client, then run every required gate. Do not treat a prepared workflow as a successful CI run. Detailed evidence and limitations are in [TASK004_STATUS](TASK004_STATUS.md).
