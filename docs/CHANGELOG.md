# Documentation change history

## 2026-11-05 — Task 004 application foundation source

The full Task 004 brief arrived, resolving the missing-scope blocker. Added application/UI/PWA/Prisma/testing/CI source and local Git without domain workflows, migrations, production access, remote, commit or deployment. Registry access prevented package installation and genuine lockfile generation; runtime acceptance remains incomplete. README, AGENTS, documentation index and TASK004_STATUS now reflect actual scope/results; TECHNICAL_FOUNDATION records technical choices without changing business decisions. Previous guidance is byte-preserved in [pre-foundation history](history/pre-foundation-2026-11-05/README_HISTORY.md). Canonical product requirements/decisions remain unchanged.

## 2026-11-05 — Task 004 owner-delegated selection reconciliation

Authority: the product owner's “Selected Product Decisions and Task 004 Authorization” message delegates selection through technical orchestration. Recorded as **SELECTED WORKING DEFAULT**, not both-founders sign-off, legal/privacy validation or production approval.

- DECISIONS: preserved original D/O records; added 18 dated selected O records with authority, rationale, impacted requirements and residual gates; reconciled all 12 GAP references (six partial selections, six unmapped/open).
- PRD/SRS: preserved all 30 requirement IDs and priorities; updated authentication (staff email/password + MFA, tenant phone OTP), actual contracting party, exclusive leases, independent occupancy/availability, immutable claims, no self-approval, one-plaza payments, verification-timestamp collections, scoped verified-payment PDF receipts, sensitive approval gates and PostgreSQL transaction/concurrency requirements. IMP-001 now narrowly includes auditable opening arrears/credits, expressly authorized in the message. Deposits and full historical ledger replay are not added.
- DATABASE_DESIGN: updated conceptual boundaries and added provisional opening-entry/batch concepts; did not create a final schema/migration or assume opening credits are verified payments. Invoice grouping, date semantics, approval transitions and credit allocation remain open.
- ROLES_PERMISSIONS/API_SPECIFICATION/DESIGN_SYSTEM: propagated selected authentication, authorization, receipt privacy, payment scope, immutable claim and lifecycle constraints; left provider/transition/policy details provisional. No endpoints or business flows implemented.
- OPEN_QUESTIONS: current residual questions and exact gap mapping precede the historical register. DECISION_WORKSHOP: retained options/examples and unchecked review history, with explicit supersession notice. Phone OTP and independent availability supersede incompatible recommendations; opening import no longer lacks scope authorization.
- ROADMAP: explicit narrow MVP import addition and selected authentication/commercial context; later-release boundaries unchanged. Task 004 exclusions remain explicit.
- README/AGENTS: updated current authority and task boundaries; no permanent Task 002 prohibition overrides new user authorization, but the separately referenced Task 004 foundation brief must be recovered rather than invented.

Preservation: all pre-edit canonical Markdown files and root AGENTS.md/README.md were copied byte-for-byte into [history/pre-task004-2026-11-05](history/pre-task004-2026-11-05/README_HISTORY.md). Original root PRD/ROADMAP/DECISIONS and their planning-pack copies remain untouched. IDs are never renumbered; historic records are not relabeled as founder-approved.

Current foundation-task status and checks: [TASK004_STATUS](TASK004_STATUS.md). No Task 005, business workflow, deploy, push or production connection authorized.
