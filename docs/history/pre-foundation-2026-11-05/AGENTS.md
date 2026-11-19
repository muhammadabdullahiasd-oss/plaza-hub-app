# PlazaHub engineering instructions

## Authority and current stage

- The canonical product documents are in root [docs/](docs/README.md). Read [PRD](docs/PRD.md), [ROADMAP](docs/ROADMAP.md), [DECISIONS](docs/DECISIONS.md), [SRS](docs/SRS.md) and relevant module specifications before work.
- Root planning copies and PlazaHub_Product_Plan/docs/ are preserved historical sources. Do not update them as ongoing specifications or delete originals/archives without approval.
- Task 004 now authorizes owner-delegated decision reconciliation and the application foundation described in its separately referenced brief. That brief was not found in the available conversation/repository at reconciliation time and has been requested; do not invent its deliverables. Tasks 002/003 were documentation-only historical stages, not a permanent prohibition overriding later user authorization. No lease, billing, payment or subscription business workflows in Task 004; no Task 005, deployment, push or production connection. Git/dependency/migration actions must follow the actual recovered foundation scope rather than assumptions.
- Preserve existing requirement/decision IDs and priorities. The SRS elaborates the PRD; it cannot silently change scope. Resolve conflicts through an explicit recorded decision.
- Never invent business decisions or treat proposed defaults as founder-approved. Apply the explicitly recorded **SELECTED WORKING DEFAULTS** from owner-delegated technical orchestration, without claiming both founders signed or legal/privacy validation. Selected principles do not approve unselected workshop details. Respect residual BLOCKED/PROVISIONAL markers in [OPEN_QUESTIONS](docs/OPEN_QUESTIONS.md). Record authority/date/rationale/impacted IDs and preserve prior document versions before changing dependent specifications.

## Approved stack and service boundaries

- Use Next.js, TypeScript, PostgreSQL, Prisma, Tailwind CSS and shadcn/ui. Tenant access is a mobile-first, installable PWA that works without installation.
- Use a modular monolith with explicit services for identity/organizations, property, leasing, billing, payments, expenses, reporting, imports, files and audit.
- Keep route handlers/server actions/UI components thin. Business invariants belong in module services; shared calculations must not be duplicated between UI, jobs, reports and exports.
- Access Prisma through server-only module/data boundaries. Do not expose raw database models, credentials or private storage keys to clients.
- Provider, runtime/library version and infrastructure choices are not implicitly approved by the stack list. Consult the task and documented technical decisions before introducing dependencies or services.

## Coding and data standards (for later authorized implementation)

- Use strict TypeScript, explicit domain types and validated input at trust boundaries; avoid untyped escape hatches. Keep errors actionable without disclosing protected records.
- Use exact NGN arithmetic; never floating-point currency math. Store timestamps as UTC instants and interpret business dates in Africa/Lagos. Preserve date-only semantics for due/lease dates.
- Enforce organization-scoped foreign references, immutable invoice snapshots and auditable financial corrections. Never silently rewrite issued amounts or delete verified payment history.
- Distinguish PaymentClaim from VerifiedPayment, allocations, reversals and receipts. Pending claims never reduce balances or count as collected funds.
- Submitted claims are immutable; use the final authorized cancel/reject/resubmit path. Only authorized Owners/Accountants verify payments; staff cannot self-approve submitted transactions. Sensitive adjustments/reversals/refunds require approval gates, with unspecified approver mechanics still blocked.
- Each payment belongs to one plaza. Verified collections use verification timestamps, preserving bank-transfer dates. Receipts use per-org references and PDF output only for verified payments; never reveal financial records beyond a representative's explicit per-resource grants.
- Auditable opening arrears/credits are narrowly in MVP import scope; do not fabricate current-period billing, verified cash or receipts from them. Deposit accounting is deferred; tax lines are reviewed/manual only. Opening-credit allocation and import commit mechanics remain to specify.
- Store actual contracting landlord/authorized agent separately from the managing organization. One exclusive active lease per shop/date range; monthly/quarterly/annual billing with per-lease due dates and no automatic proration. These domain workflows are not Task 004 implementation work. Occupancy and physical availability are independent dimensions.
- Commit financial writes and required audit events atomically. Use database-backed idempotency, concurrency checks and balance constraints. UI button disabling is not duplicate protection.
- Do not hold database transactions open for external bank checks, file transfers or PDF rendering. Post-commit work must be safely retryable without repeating financial effects.
- Keep migrations reviewable and history-preserving when separately authorized. Do not create speculative tables/features for later roadmap releases.

## Security and privacy

- Enforce server-side identity, active membership, action, plaza and tenant-resource checks on every read/write, job, search, report, export and file download. Client organization IDs never prove authority.
- Staff authentication requires email/password and MFA; tenant authentication uses phone OTP with optional email and secure recovery. Shared login identities never merge business records or allow tenant authentication to bypass staff assurance. Factors/providers, phone recovery/linking and step-up details remain subject to specification.
- Deny by default. Keep each role attached to its granted scope; context switching cannot merge privileges. Recheck revoked access on subsequent requests and job/download execution.
- Platform Admin has no routine customer financial or attachment access. Exceptional support access stays disabled until an explicit, limited, expiring, audited process is approved.
- Keep object storage private and authorize attachment class as well as parent record. Never commit secrets, production personal data or payment evidence. Avoid sensitive payloads in logs/audit summaries.
- Private financial responses must not be cached by default in service workers, browser persistent storage, CDNs or shared server caches. Offline views must not present stale balances as current.
- Preserve audit attribution when users, memberships or units are deactivated. Retention and deletion require approved policy, not invented retention periods.
- The selected 30-day subscription-expiry read/export grace is not a cancellation retention/deletion schedule. Detailed post-grace permissions are unresolved; privacy/legal validation of actual retention/export windows is required before production. Manual plaza/size-tier commercial provisioning does not authorize automated subscriptions.

## Testing and release evidence

- Trace tests to requirement IDs and approved business examples. Add meaningful calculation/state/permission tests rather than tests that merely mirror implementation.
- Use real PostgreSQL integration tests for organization constraints, lease overlap, verification races, allocation limits, idempotency and correction/audit atomicity.
- Include negative tests across at least two organizations, plazas, tenants and files; cover exports, jobs, role changes and revoked access as well as CRUD.
- Verify dashboard/drill-down/export reconciliation with the same date basis and cutoff. Test partial payments, pending claims, surplus and reversals.
- Test tenant primary tasks at 360–430px and on representative Android/iPhone devices. Verify keyboard access, focus, labels, contrast, installability, offline states and logout/context-switch privacy.
- Production launch requires the PRD P0 acceptance gates, monitored failures and a demonstrated non-production database/private-file restore. Record limitations; never claim tests passed if they were not run.

## Scope control, destructive actions and reporting

- Perform only the authorized task. Gateways, maintenance, metering, automated SaaS subscriptions and other deferred roadmap work need explicit scope authorization.
- Obtain explicit human approval before destructive database or infrastructure changes, including dropping/truncating data, irreversible migrations, deleting storage, destroying environments or overwriting a live database during restore. Prepare the concrete change, impact and recovery plan for review first. Approval for a feature is not blanket approval for destructive operations.
- Preserve unrelated user files and existing archives. Do not initialize Git, install packages or change infrastructure merely to complete documentation tasks.
- Summarize files changed, requirement coverage, checks actually performed, unresolved decisions and limitations. Identify newly discovered gaps without renumbering existing decisions or silently approving defaults.
- Stop at the requested task boundary; propose subsequent work without performing it unless authorized.
