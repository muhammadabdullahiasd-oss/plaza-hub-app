# Task 005 — identity, authentication and organization isolation

## Latest continuation — 2026-11-17

**Status remains PARTIAL.** Continued the authorized source review and completed the interrupted verification. The earlier 2026-11-13 record below remains preserved history; the current unit total is **40 passed in six files**.

Two changes were completed:

- The auth wrapper previously converted every provider failure except 429 into a credentials error. Provider HTTP 5xx failures now return generic **503 temporary unavailability**, retaining `private, no-store` and excluding database/provider details. A regression test verifies the status and safe response body.
- Added `tests/unit/identity-schema.test.ts`, which runs the installed Better Auth Prisma adapter's schema check against the generated Prisma model metadata. The test asserts the schema-check source is Prisma and intercepts PostgreSQL pool connections to fail immediately if any are attempted. It passed without a connection. This verifies model/configuration compatibility, not database contents, constraints or authentication persistence.

| Continuation command/check | Actual result |
|---|---|
| Local environment discovery | No PostgreSQL service, `.env` or listener on 5432/55432; no confirmed safe database available |
| Focused `pnpm.cmd exec vitest run tests/unit/identity-schema.test.ts` | 1 passed during the continuation; also included in the full suite below |
| `pnpm.cmd lint` | PASS, zero warnings/errors |
| `pnpm.cmd typecheck` | PASS; Prisma Client 7.10.1 and Next route types generated |
| `pnpm.cmd test` | **40 passed / 0 failed**, six files |
| `pnpm.cmd db:validate` | PASS |
| `pnpm.cmd test:foundation` | **4 passed / 0 failed**, zero skipped |
| `pnpm.cmd build` | PASS, including production TypeScript/static generation |
| `pnpm.cmd test:e2e` | **31 passed / 1 failed**, 32 executed in 1.1 minutes; known WebKit skip-link failure at foundation.spec.ts:31 |
| Original keyboard test comparison | Both focus assertions and the test body remain unchanged |
| Real PostgreSQL integration | Still **BLOCKED**, zero executed; prerequisite guard was not rerun because no database/credentials were added |
| `pnpm.cmd exec prisma migrate diff --help` | Inspected the installed Prisma 7 options only; no SQL migration generated or applied |
| Scope/artifact review | No dependencies/schema/business logic changed; no `.env`, migrations, default account, commit, push, deployment or system installation |

All 12 identity browser cases passed across 360/390/768/1280px. Foundation navigation passed; the preserved Windows WebKit Tab-focus failure remains deferred. The new HTTP test uses mocked provider responses, and the schema contract is offline metadata evidence. Neither supplies the missing real PostgreSQL integration evidence.

Files added during continuation: `tests/unit/identity-schema.test.ts` and [TASK005_LOCAL_DATABASE_PLAN.md](TASK005_LOCAL_DATABASE_PLAN.md). Files modified: `src/modules/identity/http.ts`, `tests/unit/identity-http.test.ts`, `README.md` and this status record. The proposal details an isolated native PostgreSQL 17.12 installation, fresh loopback-only cluster on port 55432, separate development/test databases and reviewed identity migration. It is prepared for founder review; **no installation or provisioning approval has been inferred from “continue.”**

Next action requires either an explicitly confirmed existing local PostgreSQL environment or approval of that concrete setup proposal. Production authentication, email/invitation delivery, recovery and tenant OTP remain disabled. No Task 006 work is authorized or started.

## Initial implementation record — 2026-11-13

Recorded 2026-11-13. **Overall status: PARTIAL.** The authorized identity implementation and available local checks are complete. Acceptance as a working database-backed authentication system is withheld: no confirmed local PostgreSQL database is available, so migrations, real sign-in/sign-out, persistence/isolation and MFA recovery have not been verified. Production authentication is deliberately closed. No Task 006 work was started.

## Authority and preflight

The user explicitly authorized Task 005 despite Task 004 remaining PARTIAL and deferred the known Windows WebKit failures. This supersedes the older Task 004-only implementation restriction, without changing PRD/SRS requirement IDs, selected O/GAP defaults, founder decisions or legal/privacy gates. Canonical identity specifications were inspected and prior versions preserved under `docs/history/pre-task005-2026-11-13/` before adding implementation details.

The project was already a single Next.js App Router application with all files untracked and no Git remote. Existing work was preserved; no nested app, automatic commit, push, deployment or system tool installation occurred. Node is 24.15.0, pnpm 12.16.1, Playwright 1.65.0. Only `.env.example` exists; no local PostgreSQL listener was found at port 5432, and no approved database credentials were supplied. No database connection was attempted. Foundation source had no competing identity implementation.

## Implemented source

- **AUTH-001:** Better Auth 1.7.22 with the supported Prisma adapter, Prisma 7.10.1 driver/client, credential sign-in/sign-out, server-backed eight-hour sessions with hourly refresh and no cookie authorization cache. Cookies are HttpOnly/SameSite=Lax and Secure for HTTPS local testing; plain HTTP is permitted only for loopback development. A fixed development rate-limit key cannot be spoofed through forwarding headers; the database limiter allows five sign-in attempts/minute plus the library's factor limits. Actual database limiter behavior remains unverified.
- Auth has an explicit local-only configuration gate, loopback URL/database validation, a required non-default secret, bounded JSON bodies, exact mutation Origin checking, generic errors and private/no-store response projections. Session tokens and raw user/account records are not returned in application JSON. Public signup, account linking, organization creation and unsupported auth routes are closed. No password/invitation/reset secret is logged.
- **AUTH-002/003, O-018:** One shared User may have several organization memberships through the supported plugin's single `Member` model. Each read/write rechecks a live session and current non-revoked membership. Active organization IDs and client role fields never confer authority. Switching context does not merge roles. Owner-only staff roster, manager/accountant role updates and membership revocation are implemented with scoped target queries. Revocation clears affected active selectors while preserving membership/audit history and other organization memberships.
- **AUD-001:** Member role/revocation changes and invitation acceptance/cancellation use serializable transactions with audit insertion. User/organization references preserve attribution. Owner removal, owner transfer and owner-role invitations are conservatively closed pending continuity/approval rules; no new business policy is presumed.
- Platform capability is separate from organization ownership, is not assigned by public input or bootstrap, and grants no routine customer record access. Every unimplemented plaza, tenant-resource, financial/file action or unknown role/action fails closed. No fake domain resources were created.
- **AUTH-004:** Plugin-compatible Invitation schema and internal recipient-checked acceptance/cancellation services are prepared. Acceptance requires the verified intended email, a live session, pending/unexpired invitation, manager/accountant intended role, current inviter owner authority and no existing/revoked membership. Replay/duplicate/reactivation is denied. Public invitation issuance/acceptance and delivery are disabled because no approved email or recipient-verification mechanism is configured. These services are not an end-to-end invitation workflow.
- Staff UI: accessible sign-in, account/session status, permitted organization selector, active organization identity details, owner roster/role/revocation controls, sign-out and unavailable/forbidden states. `/staff` and `/platform` perform server checks; no fictional operational dashboard was added. Public staff/platform previews moved to `/preview/staff` and `/preview/platform`; `/` and `/tenant` remain public.
- A terminal-only first-owner bootstrap requires explicit local configuration, a database ending `_dev`, explicit confirmation, user-supplied credentials and an empty identity database. It creates an owner and audit in one transaction, assigns no platform role or verified email, refuses production, and has no HTTP endpoint. **It was not executed.**

## Identity schema and migration status

Ten models are prepared: `User`, `Account`, `Session`, `Verification`, `Organization`, `Member`, `Invitation`, `TwoFactor`, `RateLimit`, `IdentityAuditEvent`. The schema adds identity FKs, unique user email/provider account/organization membership constraints, scoped indexes and UTC `timestamptz(3)` fields. It follows the installed Better Auth organization/TOTP schema and retains the project's generated ESM client path and Prisma PostgreSQL adapter.

Prisma schema validation, formatting and generation passed. **Zero migrations created or applied; zero seed/default accounts created.** No production or other remote database is allowed by the local guard. FK enforcement, uniqueness, concurrency/audit atomicity and persistence are not proven by generation or static checks.

Fifteen real PostgreSQL integration tests are authored behind an explicit prerequisite guard. They require a separate, already-migrated loopback database ending `_test`, `PLAZAHUB_TEST_DATABASE_URL`, and `PLAZAHUB_TEST_DB_CONFIRMED=YES`. The runner does not migrate/reset/truncate; unique fixtures are cleaned up by exact IDs. In this run the guard exited with **BLOCKED and zero tests executed**. No tests were skipped to manufacture a green result.

## Commands and actual results

Commands ran in Windows PowerShell from the existing project. `pnpm.cmd` is used to avoid PowerShell script execution-policy ambiguity.

| Command/check | Actual result |
|---|---|
| `git status --short`, file/config inspection | Existing untracked work preserved; no competing auth implementation |
| `node --version`, `pnpm.cmd --version` | v24.15.0 / 12.16.1 |
| `pnpm.cmd view better-auth version` and adapter version | Both stable 1.7.22; registry query required approved network execution |
| `pnpm.cmd add --save-exact better-auth@1.7.22 @better-auth/prisma-adapter@1.7.22 @prisma/adapter-pg@7.10.1 @prisma/client@7.10.1` | PASS; approved auth dependencies installed; Prisma remains 7 |
| `pnpm.cmd add --save-dev --save-exact prisma@7.10.1` | PASS; existing Prisma CLI version pinned |
| `pnpm.cmd install --frozen-lockfile` | PASS; lockfile current, resolution skipped, supply-chain verification passed for 727 entries. Slow registry responses were warnings, not failures. No TLS/security bypass |
| `pnpm.cmd exec prisma format` | PASS after approved execution resolved sandbox EPERM |
| `pnpm.cmd db:generate` | PASS, generated Prisma Client 7.10.1; no DB connection |
| `pnpm.cmd db:validate` | PASS, identity schema valid |
| `pnpm.cmd lint` | PASS, zero errors/warnings |
| `pnpm.cmd typecheck` | PASS after fixing literal environment types in a new test fixture; strict checking retained |
| `pnpm.cmd test` | **38 passed, 0 failed**, five files |
| `pnpm.cmd test:foundation` | **4 passed, 0 failed**, zero skipped |
| `pnpm.cmd test:integration` | **BLOCKED**, prerequisite guard exited 1; **0 executed** of 15 prepared cases |
| `pnpm.cmd build` | PASS, compiled/typechecked/static generation completed; private routes are dynamic; no DB or fabricated credential required |
| `pnpm.cmd exec playwright --version` | 1.65.0 |
| `pnpm.cmd test:e2e` | **31 passed, 1 failed**, 32 executed, exit 1; known WebKit skip-link failure detailed below |
| Keyboard-case comparison against pre-change copy | Original test body unchanged, including both focus assertions |
| `git diff --check`, artifact/secret/scope review | No whitespace issue reported; generated client, browser reports and local baseline copies are ignored; only `.env.example` present; no migrations/business models or removed user files |
| Temporary browser server lifecycle | Playwright started its own `next start` at 127.0.0.1:3100; port had zero listeners after completion; no unrelated process killed |

Sandbox file/subprocess permissions initially prevented Prisma formatting/generation and baseline backup creation. The same operations succeeded through approved execution. No lint/typechecking rule was disabled. Typecheck found a test fixture environment typing issue, which was corrected. Final dependency source review also found that Better Auth's `rememberMe=false` substitutes a one-day expiry; the request projection now fixes it to true so the configured eight-hour expiry applies. A real integration assertion checks that bound when the database becomes available. Remembered second-factor devices remain disabled. The existing ESLint package deprecation notice and terminal NO_COLOR/FORCE_COLOR notices were not lint errors or application failures. No pending pnpm agent skill was blanket-approved.

## Browser comparison and Task 004 gap

After the final session-expiry correction, lint and strict typecheck passed again, the unit suite remained 38/38, the production build passed again, and the full browser rerun again produced 31 passed/1 failed (32 executed, 1.1 minutes). The table below describes that final-source run. Earlier in this task the full suite also produced 31 passed/1 failed.

| Project | Foundation cases | New identity cases | Total |
|---|---:|---:|---:|
| Chromium desktop, 1280px | 5 passed | 3 passed | 8 passed |
| Chromium mobile, 360px | 5 passed | 3 passed | 8 passed |
| Chromium tablet, 768px | 5 passed | 3 passed | 8 passed |
| WebKit iPhone 13, 390px | 4 passed / 1 failed | 3 passed | 7 passed / 1 failed |

All 12 new identity browser checks passed: anonymous staff/platform requests redirect to sign-in; forged session-cookie data requests return 401/no-store without private records; signup/org creation/invitation/reset routes return generic 404; sign-in labels/password semantics and no-overflow layouts work at all four viewports; the production build safely refuses unconfigured authentication. This verifies rejection/UI behavior, **not successful PostgreSQL-backed login or an authenticated staff roster**.

The remaining failure is `tests/e2e/foundation.spec.ts:31`: WebKit ordinary Tab leaves “Skip to main content” inactive instead of focused. The original Enter-to-main assertion remains enabled after it. Foundation preview navigation passed this time; the prior Task 004 result of 18 passed/2 failed remains historical evidence and is not rewritten. No known assertion was skipped, removed, weakened or relabeled as a pass. Current foundation subset is 19 passed/1 failed; Task 004 remains PARTIAL under the user's explicit deferral. No independent Linux/macOS verification was performed or inferred.

Evidence is in ignored `playwright-report/index.html` and `test-results/foundation-keyboard-skip-link-focuses-main-content-webkit-mobile/` (screenshot, error context and trace). Responsive screenshots for public previews are also retained under test-results. Manifest/icon cases passed in all four projects; no service worker or new private cache was added. Actual device installation/offline support is not claimed.

## Security evidence and limits

The 38 unit tests include the original eight checks plus 22 identity policy/configuration cases, six HTTP boundary cases with mocked persistence and two sign-in UI cases. They cover anonymous/missing/revoked/foreign membership, resource mismatch, manager/accountant denial of owner operations, platform/unknown/combined roles, unimplemented resource denial, self/owner escalation prevention, invalid command shapes, wrong/unverified invitation recipients, expiry/cancellation/replay states, production/remote configuration refusal, exact Origin, closed endpoints, bounded input, safe cookie/token projection, generic errors/rate responses and TOTP challenge UI.

These are policy/UI/HTTP evidence only. The 15 prepared real tests cover server-backed credentials/cookies, membership switching across two organizations, foreign member IDs without disclosure, manager escalation, platform separation, FK/unique constraints, role/audit persistence, verified invitation acceptance/rejection, replay/expiry/cancellation, membership removal, session expiry/sign-out/revocation and actual rate limiting. They did not execute. No mocked test is presented as proof of database isolation or transaction correctness. Real MFA enrollment/backup consumption, concurrent invitation/role operations and authenticated browser workflows still need a confirmed local database and further execution.

## MFA, OTP, delivery and production gates

Better Auth's supported TOTP plugin, schema, local enrollment UI, authenticator challenge and backup-code sign-in path are prepared. The library encrypts factor secrets/backup codes; UI enrollment secrets stay in component memory and are not logged or placed in persistent browser storage. Real enrollment, backup-code consumption, factor reset/recovery and account lockout behavior have **not** been tested. There is no claim that production MFA or recovery is complete. Production authentication is disabled regardless of the local opt-in flag until those gates are reviewed.

No approved email or SMS provider is configured. Email verification, invitations, password recovery and tenant phone OTP remain disabled. The future tenant workflow must bind a provider-verified phone challenge to explicit identity/representative grants, reject replay/expiry, rate-limit attempts, handle phone reassignment/recovery and require separate staff assurance. No provider, hardcoded OTP, fake verified phone or implicit tenant-to-staff privilege was introduced. Invitation issuance TTL, owner continuity, support access and privacy/retention policies retain their existing open decision status.

## Files created or modified

- Dependencies/configuration: `package.json`, `pnpm-lock.yaml`, `.env.example`, `prisma/schema.prisma`, new `vitest.integration.config.ts`.
- New server module: `src/modules/identity/{auth,config,policy,service,http,pages}.ts`; module boundary README updated.
- New client/UI helpers: `src/components/identity/{request.ts,sign-in-form.tsx,workspace-controls.tsx,mfa-enrollment.tsx}`.
- Routes: new `src/app/sign-in/page.tsx`, `src/app/api/auth/[...all]/route.ts`, `src/app/api/identity/route.ts`; staff/platform protected pages/layouts updated; public preview page/layout copies added under `src/app/preview/{staff,platform}`; landing and site-header links updated.
- New script: `scripts/bootstrap-owner.ts` (not executed).
- Tests: new `tests/unit/{identity-policy.test.ts,identity-http.test.ts,sign-in.test.tsx}`, `tests/integration/{identity.test.ts,server-only.ts}`, `tests/e2e/identity.spec.ts`; existing home tests updated for preview routes/text; foundation E2E only preview paths/screenshot names changed; static schema test now allows exactly the ten authorized identity models and continues forbidding business models/migrations.
- Documentation: this file, `README.md`, `AGENTS.md`, `docs/README.md`, `docs/DATABASE_DESIGN.md`, `docs/ROLES_PERMISSIONS.md`, `docs/API_SPECIFICATION.md`, `docs/TECHNICAL_FOUNDATION.md`, and three pre-change canonical snapshots under `docs/history/pre-task005-2026-11-13/`.

No product requirement/decision files, Task 004 investigation history, Playwright configuration, financial logic or business schema were changed. The Git repository remains uncommitted/unpushed. Because all project files were initially untracked, Git diff alone is incomplete evidence; source inspection, preserved copies and the explicit keyboard-case comparison were also used.

## References, CI and acceptance recommendation

Implementation checked against current official [Better Auth Prisma integration](https://better-auth.com/docs/adapters/prisma), [Next.js integration](https://better-auth.com/docs/integrations/next), [email/password](https://better-auth.com/docs/authentication/email-password) and [organization plugin](https://better-auth.com/docs/plugins/organization) guidance, plus the installed 1.7.22 plugin types/schema. Prisma 8 was neither installed nor selected.

The existing Ubuntu GitHub Actions workflow was inspected: pinned Node/pnpm, frozen lockfile, validate/lint/types/unit/foundation/build and Chromium/WebKit E2E. It needs no production secrets, but does not yet run the new PostgreSQL integration suite. No workflow was dispatched and no CI success is claimed.

**Recommendation: retain Task 005 as PARTIAL and do not begin Task 006.** Next, confirm/provide an approved local PostgreSQL development/test environment; review/create/apply the identity-only migration there; execute the 15 real integration cases and authenticated browser/MFA/backup tests; resolve delivery/recovery and owner-continuity requirements with the founders; and obtain the independent WebKit evidence still deferred from Task 004. No production enablement or release acceptance is recommended until these checks and approvals are complete.
