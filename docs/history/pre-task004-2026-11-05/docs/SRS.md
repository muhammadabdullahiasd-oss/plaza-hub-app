# PlazaHub v1.0 software requirements specification

Status: DRAFT foundation, 2026-11-05. Source: [PRD](PRD.md), [ROADMAP](ROADMAP.md), [DECISIONS](DECISIONS.md). This document preserves the PRD requirement IDs and priorities; it does not grant founder approval. Detailed engineering conventions below are proposals until reviewed.

## Interpretation and shared preconditions

BASELINE = requirement already stated in the PRD. PROVISIONAL = detail awaiting review. BLOCKED = the named policy-dependent part must not be finalized/implemented until answered. Baseline security and integrity invariants still apply to blocked workflows. Each record below includes actors, preconditions, behavior, edge cases, acceptance criteria and policy dependencies. Acceptance criteria for blocked behavior become executable only after the referenced decision is resolved; no default is silently selected.

All customer-data actions require authenticated active membership, a permitted action, permitted plaza scope and, for tenants, explicit representative/resource linkage. Platform Admin means PRD Platform Operator. Owner, Manager and Accountant are scoped roles. Tenant means an authorized shop-tenant representative. Every mutation validates references server-side, rejects foreign-organization resources and emits required audit events. See [ROLES_PERMISSIONS](ROLES_PERMISSIONS.md).

Money uses exact NGN arithmetic, never floating-point currency math. Pending claims do not count as collected funds. Issued financial history is preserved. Store event instants in UTC; interpret business dates and reporting boundaries in Africa/Lagos. Date-only lease/billing dates are not UTC instants. Reporting recognition dates remain BLOCKED on GAP-002. Shared transaction and concurrency requirements are in [DATABASE_DESIGN](DATABASE_DESIGN.md).

Policy references O-001–O-018 refer to [DECISIONS](DECISIONS.md#open-decisions-for-srs-workshop); GAP references refer to [OPEN_QUESTIONS](OPEN_QUESTIONS.md#additional-gaps-not-new-approved-decisions).

## Access and organization scope

### AUTH-001 — Secure authentication [P0]

- **Status/dependencies:** BASELINE; login/recovery method BLOCKED on O-014; provider selection PROVISIONAL, GAP-011.
- **Actors:** All users.
- **Preconditions:** Provisioned user or valid invitation; no active session required to sign in/recover.
- **Behavior:** Authenticate, sign out, recover access and expire/revoke sessions securely. Attribute staff actions to a user.
- **Edge cases:** Expired/replayed recovery token, revoked session, inactive membership, repeated failed attempts and tenant navigating to staff routes. Exact session/token lifetimes are provisional security configuration.
- **Acceptance:** Unauthenticated private requests return no data; revoked/expired sessions cannot read or mutate; tenant identity alone cannot open staff resources; recovery tokens cannot be reused; failure responses do not disclose another user's credentials or session.

### AUTH-002 — Scoped roles [P0]

- **Status/dependencies:** BASELINE; approval/lifecycle details BLOCKED on O-008, O-012, O-015, O-018 and GAP-006.
- **Actors:** Platform Admin, Owner, Manager, Accountant, Tenant.
- **Preconditions:** Active identity, selected context and valid grants.
- **Behavior:** Enforce action + organization + plaza + resource relationship. Switching context must not merge grants or data.
- **Edge cases:** Several roles with different scopes; revoked assignment; one person representing several tenants.
- **Acceptance:** A Plaza A manager cannot retrieve Plaza B invoices by changing IDs; a tenant cannot access another tenant's lease; an owner in organization A has no implied access to B; a deactivated assignment fails on the next protected request.

### AUTH-003 — Strict organization isolation [P0]

- **Status/dependencies:** BASELINE; exceptional support path BLOCKED on GAP-010, shared identity details O-018.
- **Actors:** All users, background jobs and support operators.
- **Preconditions:** Server-established actor/context; job context is validated as well.
- **Behavior:** Scope reads, writes, search, aggregate reports, imports, exports and file access. Reject cross-organization references. Platform Admin has no routine financial access.
- **Edge cases:** Guessed IDs, client-supplied org IDs, mixed-org import rows, export after revocation and pooled database context reuse.
- **Acceptance:** Negative tests across two organizations return no foreign records, counts, attachments or mutations; mixed-org writes roll back; a platform provisioning account cannot download customer financial data.

### AUTH-004 — Staff invitations [P0]

- **Status/dependencies:** BASELINE; invitation expiry/delivery PROVISIONAL, O-014 and GAP-009/GAP-011.
- **Actors:** Owner, invited staff.
- **Preconditions:** Owner may grant requested organization/plaza access; invite recipient is identified by the approved onboarding method.
- **Behavior:** Invite staff, accept a valid invitation and deactivate scope without deleting history.
- **Edge cases:** Duplicate invite, replayed/expired invite, existing identity in another org, inviter loses authority before acceptance.
- **Acceptance:** Accepting an invitation grants only its authorized scope; replay cannot create duplicate grants; deactivation blocks that scope while unrelated memberships remain independent; prior audit entries retain actor attribution.

## Registry and leasing

### PLZ-001 — Organization/plaza registry [P0]

- **Status/dependencies:** BASELINE; contracting/lifecycle details PROVISIONAL pending O-001, O-012.
- **Actors:** Platform Admin provisions organization; Owner/authorized Manager maintains plazas per matrix.
- **Preconditions:** Provisioning authority or active organization scope; required plaza name/address/status input.
- **Behavior:** Maintain organizations and multiple plazas with explicit ownership boundaries.
- **Edge cases:** Same display name across organizations; archived plaza with financial history; attempts to move records between organizations.
- **Acceptance:** Two organizations can independently use the same shop code; plaza listings are scoped; referenced historical records remain readable to authorized users when a plaza is retired; unauthorized organization reassignment fails.

### PLZ-002 — Unit inventory [P0]

- **Status/dependencies:** BASELINE; operational status precedence BLOCKED on GAP-005.
- **Actors:** Owner, Manager; Accountant and Tenant read permitted projections.
- **Preconditions:** Existing scoped plaza; floor/section, if supplied, belongs to that plaza.
- **Behavior:** Maintain unique unit code, type, optional area and operational status; preserve retired unit history.
- **Edge cases:** Duplicate code, code formatting/case normalization (PROVISIONAL), wrong-plaza section, out-of-service unit with an active lease.
- **Acceptance:** Duplicate identifiers under the approved normalization fail within a plaza; same code in another plaza succeeds; cross-plaza section linkage fails; retirement does not delete leases/invoices. GAP-005 must settle conflicting occupancy labels.

### TEN-001 — Shop tenant profiles [P0]

- **Status/dependencies:** BASELINE; contracting/representative model BLOCKED on O-001, O-018 and GAP-006; visible fields O-016.
- **Actors:** Owner, Manager; Accountant reads; Tenant sees authorized summary.
- **Preconditions:** Organization scope; required legal/display name and approved contact fields.
- **Behavior:** Maintain organization-owned tenant/business profiles and associate multiple dated leases. Keep login users and representatives separate from business records.
- **Edge cases:** Same phone/name across organizations, profile without login, multiple representatives and revoked representation.
- **Acceptance:** One tenant can have two units through leases; staff sees only history within permitted scope; matching names/emails never grants access; removing representative access preserves business/financial history.

### LSE-001 — Dated leases [P0]

- **Status/dependencies:** BASELINE; final cardinality/date and overlap policy BLOCKED on O-001–O-004, GAP-005.
- **Actors:** Owner, Manager.
- **Preconditions:** Same-org tenant/unit; approved lease terms, dates, amount, cadence and due-date rule.
- **Behavior:** Record dated agreement and status; reject incompatible overlapping exclusive active leases. Monthly/quarterly/annual frequencies are the PRD baseline, with exact rules unresolved.
- **Edge cases:** Same-day turnover, open-ended lease, future activation, end before start, simultaneous requests for the same unit.
- **Acceptance:** Invalid date order fails; expired leases remain queryable; under the approved exclusivity rule, two concurrent incompatible leases cannot both commit. Boundary-date examples must be supplied after O-002/O-003 resolution.

### LSE-002 — Lease changes with history [P0]

- **Status/dependencies:** BASELINE; effective-date/proration rules BLOCKED on O-003, O-004 and GAP-004.
- **Actors:** Owner, Manager.
- **Preconditions:** Existing scoped lease and reason/effective date for renewal or termination.
- **Behavior:** Preserve prior terms; create a new version/renewal reference rather than rewriting historical invoices.
- **Edge cases:** Backdated termination, renewal overlapping another lease, rent change after billing, concurrent updates.
- **Acceptance:** Renewing terms leaves earlier invoice snapshots unchanged; stale edits produce a conflict; termination retains past receipts and audit references; no automatic prorated credit is invented.

### LSE-003 — Occupancy calculation [P0]

- **Status/dependencies:** BASELINE; exclusive-date/status precedence and denominator BLOCKED on O-002 and GAP-005.
- **Actors:** Owner, Manager, authorized report viewers.
- **Preconditions:** Scoped inventory, effective business date and approved status policy.
- **Behavior:** Derive occupied/vacant counts from applicable leases, report out-of-service units explicitly and preserve historical interpretation.
- **Edge cases:** Future/expired lease, retired unit, occupied unit marked out of service, date-boundary turnover.
- **Acceptance:** Future leases do not imply current occupancy; historical results match applicable lease versions; manual labels cannot conceal an active lease; mutually exclusive counts/overlap disclosures reconcile under the approved GAP-005 rule.

## Billing and service charges

### BIL-001 — Rent invoices [P0]

- **Status/dependencies:** BASELINE; generation policy BLOCKED on O-003–O-005, O-010, O-017 and GAP-008.
- **Actors:** Owner, Manager, Accountant; authorized scheduled process.
- **Preconditions:** Eligible lease/version and approved period, amount, due rule and issuing authority.
- **Behavior:** Preview obligations, then issue period-specific invoices with traceable lease terms. Manual and scheduled paths use the same rules.
- **Edge cases:** Month-end/leap-year dates, changed terms between preview and issue, parallel runs, retry after timeout and void/rebill.
- **Acceptance:** Preview exposes amount/period/due date; stale preview cannot silently issue changed values; retry/concurrent generation creates only one valid obligation per approved business key; issued values remain stable when lease terms later change.

### BIL-002 — Service-charge invoices [P0]

- **Status/dependencies:** BASELINE fixed/manual model; allocation rules BLOCKED on O-006, O-015, O-017.
- **Actors:** Owner, Manager, Accountant with billing authority.
- **Preconditions:** Scoped unit/lease, charge category, period and approved amount/input method.
- **Behavior:** Prepare fixed recurring or explicitly staff-entered charge lines for electricity, generator/diesel, security, cleaning and other approved categories.
- **Edge cases:** Several charges of same category in one period, retired units, missing allocation inputs and recurrence retries.
- **Acceptance:** Each line exposes category, unit/lease, period and amount; missing mandatory inputs fail; no undisclosed automatic apportionment occurs; repeating a recurring charge run does not duplicate its obligation. Business-key rules must distinguish legitimate separate charges.

### BIL-003 — Invoice lifecycle [P0]

- **Status/dependencies:** BASELINE; correction/approval and legal fields BLOCKED on O-004, O-010, O-015, O-017 and GAP-004/GAP-008.
- **Actors:** Authorized billing staff; Tenant reads own issued invoice.
- **Preconditions:** Valid draft or existing issued record; correction includes actor/reason.
- **Behavior:** Represent Draft, Issued, Partially Paid, Paid, Overdue and Voided consistently. Proposed design separates stored issuance state from calculated settlement/delinquency so partial payment and overdue can coexist.
- **Edge cases:** Paid invoice void request, due-today timezone cutoff, partial overdue invoice and concurrent issue.
- **Acceptance:** Issued amounts cannot be silently edited; correction retains original references and reason; tenant sees authoritative corrected status; issuance is atomic; allocated-invoice void behavior remains blocked until GAP-004 is approved.

### BIL-004 — Partial payment and balances [P0]

- **Status/dependencies:** BASELINE arithmetic; surplus/adjustment policy BLOCKED on O-009, GAP-004.
- **Actors:** Accountant, Owner; authorized readers including Tenant.
- **Preconditions:** Issued invoice, valid adjustments and verified active allocations.
- **Behavior:** Outstanding equals issued amount plus valid adjustments minus effective verified allocations. Enforce nonnegative debt without hiding surplus funds.
- **Edge cases:** Overpayment, reversed payment, simultaneous allocation, adjustment below already allocated amount.
- **Acceptance:** NGN 200,000 less verified NGN 75,000 equals NGN 125,000; pending NGN 75,000 leaves NGN 200,000; concurrent allocations cannot exceed invoice balance; surplus remains visible rather than being discarded or silently clamped away.

## Payments, receipts and expenses

### PAY-001 — Manual payment evidence [P0]

- **Status/dependencies:** BASELINE submission; edit/cancel transitions BLOCKED on O-007; upload limits PROVISIONAL, GAP-009.
- **Actors:** Owner, Manager, Accountant, Tenant for own account.
- **Preconditions:** Authorized payer/resource link, transfer reference/date/amount and optional permitted evidence.
- **Behavior:** Create a PaymentClaim in Pending review. Keep the submitted assertion separate from a verified financial Payment.
- **Edge cases:** Missing/invalid amount, duplicate-looking reference, upload failure, claim for another tenant, edit after submission.
- **Acceptance:** Submission does not create a verified payment, receipt or reduced balance; claim and evidence are scoped; invalid input yields field errors; potential duplicate claims are inspectable without automatically treating matching references as proof of identity.

### PAY-002 — Authorized verification [P0]

- **Status/dependencies:** BASELINE; maker/checker policy BLOCKED on O-008, O-007, GAP-003.
- **Actors:** Owner or Accountant authorized by the final approval policy.
- **Preconditions:** Pending claim and external bank-record check; current approver authority.
- **Behavior:** Verify or reject with actor/time and traceable outcome. Verification creates one authoritative verified Payment linked to its claim; duplicate reference/amount patterns warn for review.
- **Edge cases:** Repeated verify request, verify/reject race, self-verification, partial match to bank evidence and approver revoked mid-operation.
- **Acceptance:** Concurrent verification creates at most one Payment per claim; reject cannot coexist with a successful verify transition; unauthorized roles fail; verifier/time are recorded; duplicate warning does not alone approve or reject funds. Self-approval behavior awaits O-008.

### PAY-003 — Payment allocation and receipt [P0]

- **Status/dependencies:** BASELINE; credit/refund, numbering and cross-plaza policy BLOCKED on O-009, O-010, O-017 and GAP-003/GAP-008.
- **Actors:** Authorized Owner/Accountant; Tenant downloads own receipt.
- **Preconditions:** Verified funds, eligible same-organization debtor/invoices and available payment balance.
- **Behavior:** Allocate all or part of funds to one or more eligible invoices; issue downloadable receipt only for verified funds. Show unallocated remainder separately.
- **Edge cases:** Multiple invoices/plazas, zero available funds, concurrent allocations, PDF generation failure and receipt retry.
- **Acceptance:** Total effective allocations never exceed available verified funds; invoice due never becomes negative; pending/rejected claims yield no final receipt; download is authorized; retry does not create another payment or receipt reference; generation failure is recoverable without re-verification.

### PAY-004 — Corrective reversal [P0]

- **Status/dependencies:** BASELINE traceability; exact reversal/partial reversal/refund transitions BLOCKED on O-008, O-009 and GAP-002/GAP-004.
- **Actors:** Owner/Accountant subject to approval policy.
- **Preconditions:** Existing verified payment, explicit reason and allowed reversal operation.
- **Behavior:** Append linked correction records, reverse affected allocation effects atomically and retain original payment/receipt history. A correction reversal is not automatically a bank refund.
- **Edge cases:** Retry, partial reversal, already reversed payment, concurrent allocation and closed reporting period.
- **Acceptance:** Original records remain identifiable; receipt lookup discloses reversal/correction; balances and collection reports reconcile to effective records; duplicate reversal cannot deduct twice; unsupported partial/refund behavior is not inferred.

### EXP-001 — Operating expenses [P0]

- **Status/dependencies:** BASELINE; approval/recognition details BLOCKED on O-015 and GAP-002.
- **Actors:** Owner, Manager, Accountant within scope.
- **Preconditions:** Plaza, category, business date, amount, vendor/description and optional evidence.
- **Behavior:** Record categorized operating expenses separately from collections; preserve corrections with actor/reason/history.
- **Edge cases:** Future/backdated expense, duplicate entry, correction after export and wrong-plaza evidence.
- **Acceptance:** Invalid or foreign-plaza references fail; filtered totals equal included effective expense records; correction is auditable and does not silently erase the original; expense reporting is labeled recorded expenses, not inferred cash payments/profit.

## Reports and data movement

### RPT-001 — Owner overview [P0]

- **Status/dependencies:** BASELINE; date/occupancy/attribution rules BLOCKED on GAP-002, GAP-003, GAP-005 and O-005/O-009.
- **Actors:** Owner; Manager/Accountant within permitted report scope.
- **Preconditions:** Selected organization/plaza(s), period or as-of cutoff and approved metric definitions.
- **Behavior:** Display invoiced obligations, verified collections, outstanding debt, occupancy and recorded expenses with drill-down and explicit date basis.
- **Edge cases:** No data, unapplied funds, pending claims, reversals after period end and restricted plaza access.
- **Acceptance:** Each total equals its detail records under the same cutoff; pending claims excluded from collections; unpaid is not automatically overdue; currency/timezone/date basis shown; totals cannot reveal another scope by aggregation.

### RPT-002 — Operational reports [P0]

- **Status/dependencies:** BASELINE; ageing, recognition and suspension policy BLOCKED on GAP-002, GAP-003, O-012.
- **Actors:** Owner, Manager, Accountant; Tenant only own permitted records.
- **Preconditions:** Authorized filter set, pagination and approved ageing/date definitions.
- **Behavior:** Provide aged receivables, invoice status, payment ledger and expenses by category; export using identical calculation rules.
- **Edge cases:** Due-today debt, timezone boundary, revoked access during export, large result and concurrent transaction changes.
- **Acceptance:** Screen/export totals match for the same data snapshot/cutoff; output identifies filters and generation time; tenant export cannot include other accounts; inaccessible rows are excluded from both details and totals.

### IMP-001 — Data import/export [P0]

- **Status/dependencies:** BASELINE units/tenants/leases import; matching/commit policy BLOCKED on GAP-009; opening finance scope BLOCKED on GAP-001 and O-005/O-009; retention O-013.
- **Actors:** Authorized staff under provisional import permissions; permitted report/register readers export.
- **Preconditions:** Selected organization/plaza, allowed template, validated access and approved commit policy.
- **Behavior:** Parse CSV into staged preview, validate rows/references, show row-level errors, commit explicitly and audit result. Export permitted registers/reports with scope preserved.
- **Edge cases:** Duplicate upload/row, malformed encoding, invalid lease dates, changed underlying data after preview, formula-like CSV cells and oversized files.
- **Acceptance:** Preview creates no operational records; invalid rows identify row/field/reason; commit revalidates current scope/references; retries cannot silently duplicate records; export neutralizes spreadsheet-formula injection; inserted/rejected counts reconcile. Atomic batch versus partial import must be approved before commit implementation.

## Tenant mobile PWA

### PWA-001 — Mobile-first tenant portal [P0]

- **Status/dependencies:** BASELINE; login, visibility and representative details BLOCKED on O-014, O-016, O-018, GAP-006.
- **Actors:** Tenant.
- **Preconditions:** Authenticated representative with explicit resource grants.
- **Behavior:** Show assigned shops, approved lease summary, issued invoices and current outstanding balances; provide shop/context selection.
- **Edge cases:** Multiple shops, no current lease, revoked grant, large currency values and session expiry.
- **Acceptance:** Main tasks fit 360px viewport without horizontal scrolling; changing IDs reveals no other tenant data; shop switching changes context explicitly; confidential attachments are absent unless permitted; empty/revoked states do not show stale former-account data.

### PWA-002 — Verified payment history and receipts [P0]

- **Status/dependencies:** BASELINE; receipt/visibility details BLOCKED on O-010, O-016 and GAP-003.
- **Actors:** Tenant.
- **Preconditions:** Own scoped claims/payments and current authorization.
- **Behavior:** Distinguish Pending, Rejected and Verified outcomes and show authorized receipts/corrections.
- **Edge cases:** Receipt generation failure, reversed funds, claim still pending and shared multi-plaza payment.
- **Acceptance:** Pending is never labeled settled/paid; receipt offered only for verified funds with current correction status; cross-tenant receipt URL access fails; scoped projection cannot disclose other tenants/plazas from a shared payment.

### PWA-003 — Installable app shell [P0]

- **Status/dependencies:** BASELINE; device/browser test matrix PROVISIONAL, GAP-007.
- **Actors:** Tenant.
- **Preconditions:** HTTPS deployment; manifest, icons and service worker available.
- **Behavior:** Offer browser-supported installation and app-like launch without requiring installation for any core task.
- **Edge cases:** Unsupported install prompt, iOS manual installation, updated service worker and expired login after launch.
- **Acceptance:** Test launch/install on representative Android and iPhone devices; normal browser supports identical core tasks; installed shell cannot bypass authentication; unavailable install capability does not block use.

### PWA-004 — Connectivity and cache safety [P0]

- **Status/dependencies:** BASELINE; no business-policy dependency.
- **Actors:** Tenant and authenticated staff where shared caching applies.
- **Preconditions:** Connected or disconnected browser, possibly previously authenticated.
- **Behavior:** Cache public shell assets only by default. Private financial responses must not be cached by default in service worker, shared CDN, browser persistent storage or server shared caches. Show explicit offline/unavailable-current-data state.
- **Edge cases:** Connection lost during submission, logout/account switch, browser back navigation and old service-worker version.
- **Acceptance:** Offline launch never presents old balances as current; cache inspection finds no private financial payloads; logout/context switch clears in-memory private views; ambiguous request outcome is reconciled safely with the server, not reported as confirmed or replayed as a second payment.

### PWA-005 — Tenant profile requests [P1]

- **Status/dependencies:** PROVISIONAL optional feature; approval details GAP-012 and O-015/O-016.
- **Actors:** Tenant, authorized staff reviewer.
- **Preconditions:** Own profile; feature explicitly included in delivery scope.
- **Behavior:** Submit contact-change request for staff review, without directly rewriting authoritative contact data.
- **Edge cases:** Conflicting pending requests, changed access, rejection and request trying to change login identity.
- **Acceptance:** Submission leaves current profile unchanged until approved; rejection retains previous value; another tenant cannot submit/review; approved update is audited. Authentication changes require the separately approved recovery/verification flow.

## Audit and operations

### AUD-001 — Activity trail [P0]

- **Status/dependencies:** BASELINE; retention/support projection BLOCKED on O-013 and GAP-010.
- **Actors:** System records events; Owner and permitted staff read filtered history.
- **Preconditions:** Sensitive mutation/financial transition with actor or attributable job identity.
- **Behavior:** Capture actor, organization/scope, action, resource, timestamp, reason and safe change references. Commit required audit together with financial changes.
- **Edge cases:** Failed transaction, deactivated actor, background job, audit write failure and sensitive payloads.
- **Acceptance:** Verification, void, reversal and expense correction have linked history; failed financial transaction creates no successful event; required audit failure rolls back financial mutation; application users cannot rewrite audit history; credentials/evidence content are not copied into logs.

### OPS-001 — Backup, restore and monitoring [P0]

- **Status/dependencies:** BASELINE; retention, recovery targets/providers BLOCKED on O-013, GAP-007/GAP-011.
- **Actors:** Authorized operations staff.
- **Preconditions:** Approved infrastructure, backup targets and non-production restore environment.
- **Behavior:** Document database/private-file backup and restoration, monitor failures and maintain incident/rollback/reconciliation procedures.
- **Edge cases:** Database restored without corresponding files, missing keys/configuration, failed backup and accidental restore into production.
- **Acceptance:** Demonstrated non-production restore recovers linked database/files; verify financial totals and access controls afterward; alert test reaches designated operator; measured recovery meets approved objectives. Destructive database/infrastructure actions require prior human approval.

### OPS-002 — Protected file handling [P0]

- **Status/dependencies:** BASELINE; visibility/retention/limits BLOCKED or PROVISIONAL under O-013, O-016, GAP-009.
- **Actors:** Authorized staff and Tenant for permitted attachments.
- **Preconditions:** Private asset belongs to same organization and an authorized parent record; attachment class permits this viewer.
- **Behavior:** Validate upload type/size, keep object storage private and authorize download. Proposed default is application-mediated streaming; any signed URL must be short-lived and must not bypass required cross-user controls.
- **Edge cases:** MIME spoofing, malicious files, orphan upload, copied URL, revoked membership and expired link.
- **Acceptance:** Unauthenticated/foreign-user file access fails; copied application URL requires fresh authorization; no permanent public object URL exists; invalid uploads fail safely; attachment access does not follow parent access if confidential class is excluded.

## State-machine foundation (not approved business policy)

| Aggregate | Baseline transition intent | Unresolved branch |
|---|---|---|
| Lease | Record dated terms; renew/terminate with history | Exact statuses, exclusivity, date bounds and backdating: O-002–O-004 |
| Invoice | Draft → Issued; issued correction preserves original | Void with allocations, credits and approval: O-015, GAP-004 |
| PaymentClaim | Pending → Verified outcome or Rejected outcome; verification creates Payment | Editing/cancel/re-submit and self-review: O-007/O-008 |
| Verified Payment | Verified funds → allocated/unallocated portions; linked reversal preserves history | Partial reversal, refund and cross-plaza allocation: O-009, GAP-003/GAP-004 |
| Receipt | Issued for verified payment; lookup discloses subsequent correction | Numbering/reissue fields: O-010 |
| ImportJob | Upload → validation/preview → explicit commit → result | Partial-versus-atomic commit and duplicate matching: GAP-009 |

## Cross-cutting acceptance and traceability

- Security: HTTPS, secure sessions, rate limiting, least privilege and negative tests across organizations/plazas/tenants/files. No default platform financial bypass.
- Integrity: unit tests for exact arithmetic and permissions; real PostgreSQL integration tests for overlap, references, retries, allocation races and audit atomicity; E2E owner/accountant/tenant scenarios.
- Performance: PRD target is approximately p95 under two seconds for common authenticated navigation/data responses on representative pilot data and connection. Dataset/workload must be agreed under GAP-007; this is not a measured result or SLA.
- Accessibility/mobile: keyboard focus, labels, contrast and documented exceptions against the PRD WCAG 2.2 AA aim; 360–430px tenant testing and representative Android/iPhone devices.
- Release: all P0 requirements implemented or explicitly excepted by founders; J1–J7 rehearsed; restore/monitoring tested; no unexplained financial discrepancies or known isolation leaks. PWA-005 remains P1.

| PRD journey | SRS coverage |
|---|---|
| J1 setup | AUTH-001–AUTH-004, PLZ-001–PLZ-002, IMP-001 |
| J2 tenant/lease | TEN-001, LSE-001–LSE-003, OPS-002 |
| J3 billing | BIL-001–BIL-004, AUD-001 |
| J4 payments | PAY-001–PAY-004, BIL-004, AUD-001 |
| J5 expenses | EXP-001, OPS-002 |
| J6 owner reporting | RPT-001–RPT-002, IMP-001, LSE-003 |
| J7 tenant portal | PWA-001–PWA-005, AUTH-001–AUTH-003, OPS-002 |
| Production operations | OPS-001, AUD-001, AUTH-003 |

Rehearsal fixture from PRD: NGN 600,000 rent + NGN 40,000 service charge. A pending NGN 250,000 claim leaves NGN 640,000 outstanding and zero verified collections from that claim. Verification/allocation to rent leaves NGN 350,000 rent + NGN 40,000 service charge = NGN 390,000 outstanding. Reports and receipt must reconcile. Whether outstanding is also overdue depends on approved due dates; do not assume it.

This SRS contains the complete 30-requirement PRD functional set (29 P0, one P1), not an implemented or approved final specification. Field limits, provider contracts and policy-dependent expected values require subsequent review. No tests are claimed executed here.
