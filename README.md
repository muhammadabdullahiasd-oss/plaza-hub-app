# PlazaHub

Multi-tenant commercial plaza management SaaS for Nigeria. Public previews remain available. Task 005 adds local staff identity, authentication and organization authorization source; operational workflows are not implemented.

**Status (2026-11-17): Task 005 PARTIAL.** Lint, strict types, 40 unit tests, four foundation checks, Prisma validation/generation and build pass. Authentication persistence and migrations require a confirmed local PostgreSQL database, which is unavailable here. Production authentication is disabled pending MFA/recovery verification. See [Task 005 results](docs/TASK005_STATUS.md) and [Task 004 history](docs/TASK004_STATUS.md); the deferred WebKit assertions remain enabled.

## Documentation authority

[docs/](docs/README.md) is authoritative. Read [PRD](docs/PRD.md), [DECISIONS](docs/DECISIONS.md), [SRS](docs/SRS.md), [OPEN_QUESTIONS](docs/OPEN_QUESTIONS.md) and [AGENTS.md](AGENTS.md). Selected working defaults are owner-delegated direction, not joint-founder sign-off or legal/privacy approval. Original root/PlazaHub_Product_Plan planning copies remain unchanged. Earlier guidance is preserved in [history](docs/history/pre-foundation-2026-11-05/README_HISTORY.md).

## Local startup

Prerequisites: Node.js 24.15.0, pnpm 12.16.1 and approved package-registry access. From this project root in Windows PowerShell:

```powershell
pnpm.cmd install --frozen-lockfile
pnpm.cmd db:validate
pnpm.cmd db:generate
pnpm.cmd dev
```

Open the address printed by Next.js. Routes `/`, `/preview/staff`, `/preview/platform` and `/tenant` are public; `/staff` and `/platform` are server-protected. `/sign-in` renders a safe unavailable state without local identity configuration. Public rendering, typecheck and build need no live database or `.env`. Copy `.env.example` only when configuring approved local development; never overwrite an existing `.env`. Use `pnpm.cmd` in PowerShell if execution policy blocks `pnpm.ps1`.

The existing genuine `pnpm-lock.yaml` passed frozen installation without changes. Builds and tests verify compatibility of the installed foundation stack; exact versions are recorded in the status report. Use `pnpm install --frozen-lockfile` for reproducible installs. Do not hand-create a lockfile or indiscriminately allow package build scripts. pnpm 12 settings are in `pnpm-workspace.yaml`.

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Loopback development server |
| `pnpm build` | Generate Prisma client and create production build |
| `pnpm start` | Serve existing production build locally |
| `pnpm lint` | ESLint, no warnings allowed |
| `pnpm typecheck` | Generate Prisma/Next types and run strict TypeScript |
| `pnpm test` / `pnpm test:watch` | Vitest policy, mocked HTTP, UI and database-URL guard tests |
| `pnpm test:integration` | Real identity PostgreSQL tests; refuses an unconfirmed/remote database |
| `pnpm auth:bootstrap` | Guarded first-owner CLI for an empty confirmed local development DB |
| `pnpm test:foundation` | Static icon/schema/contrast/URL checks |
| `pnpm test:e2e` / `pnpm test:e2e:ui` | Playwright; build first |
| `pnpm check` | Prisma validation, lint, types, unit/static tests, build |
| `pnpm db:validate` / `pnpm db:generate` | Validate identity schema / generate Prisma 7 client without connecting |
| `pnpm db:check` | Explicit local PostgreSQL SELECT 1 probe |
| `pnpm icons:generate` | Recreate original deterministic PNG icons |

Dependency-free checks can run now with Node 24:

```powershell
node scripts/generate-icons.mjs
node --test --test-isolation=none tests/foundation/assets.test.mjs
```

## Optional local PostgreSQL

`.env.example` supplies only optional Compose development values, not proof that a database exists. Never substitute production credentials. Prisma 7 uses `prisma.config.ts`, `prisma-client` generation and `@prisma/adapter-pg`; its lazy server-only lifecycle is in `src/lib/db/client.ts`. Ten identity-only models are prepared. No migrations or seeded accounts have been created/applied.

If Docker Compose is installed and `.env` is safely configured:

```powershell
docker compose up -d postgres
pnpm db:generate
pnpm db:check
docker compose stop postgres
```

Compose binds PostgreSQL 17 to 127.0.0.1:5432 and uses a persistent local volume. An existing local development PostgreSQL is also suitable. URL validation rejects remote hosts, query overrides and non-PostgreSQL URLs. Docker was unavailable here and database connectivity has not been tested. Build/generation do not require a live database.

## Browser checks and CI

```powershell
pnpm exec playwright install chromium webkit
pnpm build
pnpm test:e2e
```

Playwright starts and stops its own production server at 127.0.0.1:3100. Eight cases per project cover the original foundation checks plus protected-route rejection, disabled endpoints and accessible/responsive sign-in: Chromium at 1280px, 360px and 768px, plus iPhone 13 WebKit at 390px. These tests do not prove a database-backed sign-in succeeds. Screenshots and HTML reports remain ignored. The known Windows WebKit keyboard assertion remains enabled. Actual device install prompts and standalone launches remain unverified.

GitHub Actions is configured for pull requests/manual dispatch: frozen installation, Prisma validation, lint, types, unit/static tests, build and browser installation/tests. Its required lockfile now exists. The workflow was inspected but has not been executed; no GitHub Actions pass is claimed. No production secrets or automatic deployment are required.

## PWA and architecture

Tenant manifest delivery and configured 192/512px PNG dimensions passed browser tests; maskable and Apple icon assets passed static checks. Chromium reported no manifest parsing or installability errors on localhost. This is not proof of an actual install or standalone launch on Android/iPhone. No service worker is registered; offline access, notifications and background sync are unavailable. Never cache private financial responses or documents by default.

[Module boundaries](src/modules/README.md) define identity, organizations, property, leasing, billing, payments, expenses, reporting, imports, files and audit without fake services. [Technical choices](docs/TECHNICAL_FOUNDATION.md) records implementation details without changing business decisions.

## Troubleshooting

- Missing pnpm/registry errors: use approved package-registry access; do not bypass network controls. The earlier installation blocker is resolved.
- Missing generated client: install dependencies and run `pnpm db:generate`; do not add speculative models.
- Sandbox EPERM/store-lock errors: use the approved execution environment. Prisma generation, test/browser subprocesses and package-store writes required approved execution outside the sandbox here. Do not disable lint, strict types or browser assertions to bypass failures.
- WebKit skip-link failure on Windows: see the reproducible focus limitation in the status report. Verify the unchanged assertion in a working WebKit environment; Chromium keyboard checks pass.
- Port 3100 occupied: stop your local server before E2E; tests refuse to reuse another server.
- Database connection refused: check your local PostgreSQL and development-only `.env`; public previews do not require it.

Task 006, production access, deployment, push and automatic commits remain outside this task.

## Local identity setup (database steps not executed here)

A concrete isolated native PostgreSQL option is prepared in [the local database proposal](docs/TASK005_LOCAL_DATABASE_PLAN.md). Installation/provisioning is not yet approved or executed.

1. Obtain an explicitly confirmed local PostgreSQL development database and safe credentials. No Docker/WSL/system tool installation is implied. Review `prisma/schema.prisma`; only then create a non-destructive migration with `pnpm.cmd exec prisma migrate dev --name identity --create-only`, inspect its SQL, and apply it to that confirmed database with the reviewed migration workflow. Never use reset or `db push` as a shortcut. No migration was created during Task 005.
2. In an ignored `.env`, set the explicit loopback `DATABASE_URL`, `PLAZAHUB_AUTH_MODE=local`, `BETTER_AUTH_URL=http://127.0.0.1:3000` (matching your actual dev port) and a newly generated high-entropy `BETTER_AUTH_SECRET` of at least 32 bytes. No secret is supplied in source. `pnpm.cmd dev` binds loopback. `pnpm.cmd start` intentionally keeps authentication closed because production MFA/recovery has not been approved.
3. For the first owner only, supply `PLAZAHUB_BOOTSTRAP_CONFIRM=local-empty-database`, `PLAZAHUB_BOOTSTRAP_EMAIL`, `PLAZAHUB_BOOTSTRAP_NAME`, `PLAZAHUB_BOOTSTRAP_ORGANIZATION`, `PLAZAHUB_BOOTSTRAP_SLUG`, and a unique 12–128-character `PLAZAHUB_BOOTSTRAP_PASSWORD`. The database name must end in `_dev`; the script refuses existing users/organizations. Provide the password without placing it in shell history, for example with PowerShell `Read-Host -AsSecureString` converted in memory. Run `pnpm.cmd auth:bootstrap`, then clear the bootstrap environment variables. The script has not been executed here; it assigns no verified email or platform privilege and never prints credentials.
4. Sign in, choose a permitted organization and rehearse TOTP enrollment/backup-code login locally. Password recovery, email verification, invitation delivery and tenant OTP are unavailable. Do not treat this local setup as production-ready or populate it with production personal data.

For the 15 prepared PostgreSQL integration cases, use a separate already-migrated, confirmed local database whose name ends in `_test`. Set `PLAZAHUB_TEST_DATABASE_URL` and `PLAZAHUB_TEST_DB_CONFIRMED=YES`, then run `pnpm.cmd test:integration`. The runner generates an ephemeral test-only auth secret; it does not invent DB credentials, migrate, reset or truncate. It creates unique fixtures and deletes only their exact IDs. Tests exercise real credentials/cookies, role boundaries, revocation, constraints and invitation persistence. Wait for the one-minute rate-limit window before an immediate rerun against the same test database. Missing prerequisites exit nonzero with BLOCKED; zero tests executed is never a pass.
