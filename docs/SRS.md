# PlazaHub v1.0 software requirements specification

Status: foundation specification revised 2026-11-05 to incorporate [owner-delegated selections](DECISIONS.md#current-selected-working-defaults). **SELECTED WORKING DEFAULT** is not both-founders sign-off, legal/privacy validation or production approval. All 30 PRD IDs and priorities remain unchanged. [Pre-selection SRS](history/pre-task004-2026-11-05/docs/SRS.md) preserves history. Unselected engineering/policy details remain provisional or blocked. No lease/billing/payment/subscription workflows are authorized for Task 004.

## Interpretation and shared preconditions

BASELINE = requirement already stated in the PRD. SELECTED WORKING DEFAULT = explicit owner-delegated selection of the stated rule, not blanket approval of details. PROVISIONAL = detail awaiting review. BLOCKED = named unresolved part cannot be finalized/implemented until answered. Selected security/integrity invariants still apply to blocked workflows. Each record includes actors, preconditions, behavior, edge cases, acceptance criteria and dependencies. Criteria depending on unresolved details require explicit expected values before implementation; no default is silently selected.

All customer-data actions require authenticated active membership, a permitted action, permitted plaza scope and, for tenants, explicit representative/resource linkage. Platform Admin means PRD Platform Operator. Owner, Manager and Accountant are scoped roles. Tenant means an authorized shop-tenant representative. Every mutation validates references server-side, rejects foreign-organization resources and emits required audit events. See [ROLES_PERMISSIONS](ROLES_PERMISSIONS.md).

Money uses exact NGN arithmetic, never floating-point currency math. Pending claims do not count as collected funds. Issued financial history is preserved. Store event instants in UTC; interpret business dates and reporting boundaries in Africa/Lagos. Date-only lease/billing dates are not UTC instants. Verified collections use verification timestamps with bank-transfer dates retained separately (GAP-002); reversal/restatement, ageing and expense cutoffs remain blocked. Critical financial operations require PostgreSQL transactions and concurrency protection. Shared requirements are in [DATABASE_DESIGN](DATABASE_DESIGN.md).

Current O-001–O-018 selections are in [DECISIONS](DECISIONS.md#current-selected-working-defaults); GAP mapping is in [OPEN_QUESTIONS](OPEN_QUESTIONS.md#current-gap-mapping). Original IDs and historical source records remain available in those documents and the history snapshot.

## Access and organization scope

### AUTH-001 — Secure authentication [P0]

- **Status/dependencies:** SELECTED WORKING DEFAULT O-014: staff email/password plus MFA; tenant phone OTP with optional email and secure recovery. Provider, MFA factor, OTP/recovery and mixed-role step-up mechanics remain BLOCKED under GAP-011.
- **Actors:** All users.
- **Preconditions:** Provisioned user or valid invitation; no active session required to sign in/recover.
- **Behavior:** Authenticate staff with email/password plus MFA and tenants with phone OTP; optional tenant email does not silently become a bypass. Provide secure recovery, sign-out, expiry/revocation and attributable actions. A shared tenant/staff identity must satisfy staff authentication assurance before staff access; exact step-up/recovery mechanics require design.
- **Edge cases:** Expired/replayed recovery token, revoked session, inactive membership, repeated failed attempts and tenant navigating to staff routes. Exact session/token lifetimes are provisional security configuration.
- **Acceptance:** Unauthenticated private requests return no data; revoked/expired sessions cannot read or mutate; tenant identity alone cannot open staff resources; staff cannot access staff resources without MFA assurance; tenant OTP does not bypass staff assurance; recovery tokens cannot be reused; failure responses disclose no credentials/session. OTP expiry/replay, abuse limits and phone reassignment require approved technical acceptance values before integration.

### AUTH-002 — Scoped roles [P0]

- **Status/dependencies:** SELECTED WORKING DEFAULTS O-008/O-012/O-015/O-018 and GAP-006 set no self-approval, 30-day grace, sensitive-action gates, shared identity isolation and per-resource grants. Exact role/approval, post-grace and grant-lifecycle rules remain BLOCKED.
- **Actors:** Platform Admin, Owner, Manager, Accountant, Tenant.
- **Preconditions:** Active identity, selected context and valid grants.
- **Behavior:** Enforce action + organization + plaza + resource relationship. Switching context must not merge grants or data.
- **Edge cases:** Several roles with different scopes; revoked assignment; one person representing several tenants.
- **Acceptance:** A Plaza A manager cannot retrieve Plaza B invoices by changing IDs; a tenant cannot access another tenant's lease; an owner in organization A has no implied access to B; a deactivated assignment fails on the next protected request.

### AUTH-003 — Strict organization isolation [P0]

- **Status/dependencies:** BASELINE isolation plus SELECTED WORKING DEFAULT O-018 shared identities with isolated business records; exceptional support remains BLOCKED on GAP-010.
- **Actors:** All users, background jobs and support operators.
- **Preconditions:** Server-established actor/context; job context is validated as well.
- **Behavior:** Scope reads, writes, search, aggregate reports, imports, exports and file access. Reject cross-organization references. Platform Admin has no routine financial access.
- **Edge cases:** Guessed IDs, client-supplied org IDs, mixed-org import rows, export after revocation and pooled database context reuse.
- **Acceptance:** Negative tests across two organizations return no foreign records, counts, attachments or mutations; mixed-org writes roll back; a platform provisioning account cannot download customer financial data.

### AUTH-004 — Staff invitations [P0]

- **Status/dependencies:** BASELINE invitations with selected O-014 staff email/password + MFA and tenant phone OTP. Invitation recipient verification, expiry and provider details remain PROVISIONAL/BLOCKED under GAP-009/GAP-011.
- **Actors:** Owner, invited staff.
- **Preconditions:** Owner may grant requested organization/plaza access; invite recipient is identified by the approved onboarding method.
- **Behavior:** Invite staff, accept a valid invitation and deactivate scope without deleting history.
- **Edge cases:** Duplicate invite, replayed/expired invite, existing identity in another org, inviter loses authority before acceptance.
- **Acceptance:** Accepting an invitation grants only its authorized scope; replay cannot create duplicate grants; deactivation blocks that scope while unrelated memberships remain independent; prior audit entries retain actor attribution.

## Registry and leasing

### PLZ-001 — Organization/plaza registry [P0]

- **Status/dependencies:** BASELINE registry; O-001 selects separate actual contracting party; O-012 selects 30-day expiry read/export grace. Detailed lifecycle permissions remain BLOCKED.
- **Actors:** Platform Admin provisions organization; Owner/authorized Manager maintains plazas per matrix.
- **Preconditions:** Provisioning authority or active organization scope; required plaza name/address/status input.
- **Behavior:** Maintain organizations and multiple plazas with explicit ownership boundaries.
- **Edge cases:** Same display name across organizations; archived plaza with financial history; attempts to move records between organizations.
- **Acceptance:** Two organizations can independently use the same shop code; plaza listings are scoped; referenced historical records remain readable to authorized users when a plaza is retired; unauthorized organization reassignment fails.

### PLZ-002 — Unit inventory [P0]

- **Status/dependencies:** BASELINE inventory; SELECTED WORKING DEFAULT GAP-005 keeps physical availability independent of occupancy. Activation/retirement rules and aggregate display remain BLOCKED.
- **Actors:** Owner, Manager; Accountant and Tenant read permitted projections.
- **Preconditions:** Existing scoped plaza; floor/section, if supplied, belongs to that plaza.
- **Behavior:** Maintain unique unit code, type, optional area and operational status; preserve retired unit history.
- **Edge cases:** Duplicate code, code formatting/case normalization (PROVISIONAL), wrong-plaza section, out-of-service unit with an active lease.
- **Acceptance:** Duplicate identifiers under the approved normalization fail within a plaza; same code in another plaza succeeds; cross-plaza section linkage fails; retirement does not delete leases/invoices. GAP-005 must settle conflicting occupancy labels.

### TEN-001 — Shop tenant profiles [P0]

- **Status/dependencies:** SELECTED WORKING DEFAULTS O-001/O-016/O-018 and GAP-006: separate contracting party, authorized summaries, shared login with isolated business records and explicit per-resource representative grants. Multiplicity, grant administration and field allowlists remain BLOCKED.
- **Actors:** Owner, Manager; Accountant reads; Tenant sees authorized summary.
- **Preconditions:** Organization scope; required legal/display name and approved contact fields.
- **Behavior:** Maintain organization-owned tenant/business profiles and associate multiple dated leases. Keep login users and representatives separate from business records.
- **Edge cases:** Same phone/name across organizations, profile without login, multiple representatives and revoked representation.
- **Acceptance:** One tenant can have two units through leases; staff sees only history within permitted scope; matching names/emails never grants access; removing representative access preserves business/financial history.

### LSE-001 — Dated leases [P0]

- **Status/dependencies:** SELECTED WORKING DEFAULTS O-001–O-004: actual landlord/agent, exclusive shop/date-range lease, monthly/quarterly/annual due dates, no automatic proration. Exact date boundaries, schedule anchoring and availability-based activation remain BLOCKED.
- **Actors:** Owner, Manager.
- **Preconditions:** Same-org tenant/unit; approved lease terms, dates, amount, cadence and due-date rule.
- **Behavior:** Record dated agreement and status; reject incompatible overlapping exclusive active leases. Monthly/quarterly/annual frequencies are the PRD baseline, with exact rules unresolved.
- **Edge cases:** Same-day turnover, open-ended lease, future activation, end before start, simultaneous requests for the same unit.
- **Acceptance:** Invalid date order fails; expired leases remain queryable; under selected O-002 exclusivity, two concurrent incompatible leases cannot both commit. Exact boundary-date examples still require O-003 endpoint semantics before implementation.

### LSE-002 — Lease changes with history [P0]

- **Status/dependencies:** BASELINE historical terms; O-004 selects audited manual adjustments without automatic proration. Renewal representation, effective-date rules and correction effects remain BLOCKED under O-003/GAP-004.
- **Actors:** Owner, Manager.
- **Preconditions:** Existing scoped lease and reason/effective date for renewal or termination.
- **Behavior:** Preserve prior terms; create a new version/renewal reference rather than rewriting historical invoices.
- **Edge cases:** Backdated termination, renewal overlapping another lease, rent change after billing, concurrent updates.
- **Acceptance:** Renewing terms leaves earlier invoice snapshots unchanged; stale edits produce a conflict; termination retains past receipts and audit references; no automatic prorated credit is invented.

### LSE-003 — Occupancy calculation [P0]

- **Status/dependencies:** SELECTED WORKING DEFAULT O-002 exclusive leases and GAP-005 independent occupancy/physical availability. Date boundaries, occupancy-rate denominator and display/activation rules remain BLOCKED.
- **Actors:** Owner, Manager, authorized report viewers.
- **Preconditions:** Scoped inventory, effective business date and approved status policy.
- **Behavior:** Derive occupied/vacant status from applicable leases and track physical availability separately. A leased unit can also be physically out of service; show overlap explicitly and preserve historical interpretation. Neither dimension overwrites the other.
- **Edge cases:** Future/expired lease, retired unit, occupied unit marked out of service, date-boundary turnover.
- **Acceptance:** Future leases do not imply current occupancy; historical results match applicable lease versions; manual availability labels cannot conceal an active lease. A unit may simultaneously appear occupied and out of service, with clearly labeled separate dimensions rather than a misleading additive total. Occupancy-rate denominator remains unselected; the workshop's 75% example is not an approved oracle.

## Billing and service charges

### BIL-001 — Rent invoices [P0]

- **Status/dependencies:** Selected cadence/per-lease due dates (O-003), no automatic proration (O-004), no deposits (O-005), reviewed manual tax lines only (O-017). First bill/anchor, issued fields and grouping remain BLOCKED under O-003/O-010/GAP-008.
- **Actors:** Owner, Manager, Accountant; authorized scheduled process.
- **Preconditions:** Eligible lease/version and approved period, amount, due rule and issuing authority.
- **Behavior:** Preview obligations, then issue period-specific invoices with traceable lease terms. Manual and scheduled paths use the same rules.
- **Edge cases:** Month-end/leap-year dates, changed terms between preview and issue, parallel runs, retry after timeout and void/rebill.
- **Acceptance:** Preview exposes amount/period/due date; stale preview cannot silently issue changed values; retry/concurrent generation creates only one valid obligation per approved business key; issued values remain stable when lease terms later change.

### BIL-002 — Service-charge invoices [P0]

- **Status/dependencies:** SELECTED WORKING DEFAULT O-006 fixed/authorized manual allocation; O-015 sensitive-action gates; O-017 reviewed manual tax lines only. Occurrence identity, inputs and exact approval actions remain BLOCKED.
- **Actors:** Owner, Manager, Accountant with billing authority.
- **Preconditions:** Scoped unit/lease, charge category, period and approved amount/input method.
- **Behavior:** Prepare fixed recurring or explicitly staff-entered charge lines for electricity, generator/diesel, security, cleaning and other approved categories.
- **Edge cases:** Several charges of same category in one period, retired units, missing allocation inputs and recurrence retries.
- **Acceptance:** Each line exposes category, unit/lease, period and amount; missing mandatory inputs fail; no undisclosed automatic apportionment occurs; repeating a recurring charge run does not duplicate its obligation. Business-key rules must distinguish legitimate separate charges.

### BIL-003 — Invoice lifecycle [P0]

- **Status/dependencies:** SELECTED WORKING DEFAULTS O-004/O-015/GAP-004: preserve issued invoices, audited manual corrections/reversals and approval gates with PostgreSQL transaction/concurrency protection. Allocated-invoice correction mechanics, numbering/legal fields and grouping remain BLOCKED.
- **Actors:** Authorized billing staff; Tenant reads own issued invoice.
- **Preconditions:** Valid draft or existing issued record; correction includes actor/reason.
- **Behavior:** Represent Draft, Issued, Partially Paid, Paid, Overdue and Voided consistently. Proposed design separates stored issuance state from calculated settlement/delinquency so partial payment and overdue can coexist.
- **Edge cases:** Paid invoice void request, due-today timezone cutoff, partial overdue invoice and concurrent issue.
- **Acceptance:** Issued amounts cannot be silently edited; correction retains original references and reason; tenant sees authoritative corrected status; issuance is atomic; allocated-invoice void behavior remains blocked until GAP-004 is approved.

### BIL-004 — Partial payment and balances [P0]

- **Status/dependencies:** BASELINE exact partial-payment arithmetic; O-009 selects visible auditable unapplied funds. Adjustment/allocation/refund and opening-credit semantics remain BLOCKED under GAP-001/GAP-004.
- **Actors:** Accountant, Owner; authorized readers including Tenant.
- **Preconditions:** Issued invoice, valid adjustments and verified active allocations.
- **Behavior:** Outstanding equals issued amount plus valid adjustments minus effective verified allocations. Enforce nonnegative debt without hiding surplus funds.
- **Edge cases:** Overpayment, reversed payment, simultaneous allocation, adjustment below already allocated amount.
- **Acceptance:** NGN 200,000 less verified NGN 75,000 equals NGN 125,000; pending NGN 75,000 leaves NGN 200,000; concurrent allocations cannot exceed invoice balance; surplus remains visible rather than being discarded or silently clamped away.

## Payments, receipts and expenses

### PAY-001 — Manual payment evidence [P0]

- **Status/dependencies:** SELECTED WORKING DEFAULT O-007 immutable submitted claims corrected by cancellation/rejection and resubmission; GAP-003 one plaza per payment. Cancellation actor/state/races and upload limits remain BLOCKED/PROVISIONAL under GAP-009.
- **Actors:** Owner, Manager, Accountant, Tenant for own account.
- **Preconditions:** Authorized payer/resource link, transfer reference/date/amount and optional permitted evidence.
- **Behavior:** Create an immutable submitted PaymentClaim in Pending review. Correction uses a linked resubmission after cancellation/rejection under the final state/actor policy; never overwrite submitted evidence. Keep the assertion separate from a verified financial Payment; each payment is owned by one plaza.
- **Edge cases:** Missing/invalid amount, duplicate-looking reference, upload failure, claim for another tenant, edit after submission.
- **Acceptance:** Submission does not create a verified payment, receipt or reduced balance; claim and evidence are scoped; invalid input yields field errors; potential duplicate claims are inspectable without automatically treating matching references as proof of identity.

### PAY-002 — Authorized verification [P0]

- **Status/dependencies:** SELECTED WORKING DEFAULT O-008: only authorized Owner/Accountant verification; no staff self-approval. GAP-002 verification-timestamp collections with separate bank-transfer dates. Exact rejection authority, duplicate-bank-event review and escalation remain BLOCKED.
- **Actors:** Owner or Accountant authorized by the final approval policy.
- **Preconditions:** Pending claim and external bank-record check; current approver authority.
- **Behavior:** Only authorized Owner/Accountant may verify; staff cannot self-approve submitted transactions. Verify/reject with actor/time and traceable outcome, subject to the final per-action matrix. Verification creates one authoritative verified Payment linked to its claim; duplicate reference/amount patterns warn for review. Preserve transfer date separately; count verified collections at verification time.
- **Edge cases:** Repeated verify request, verify/reject race, self-verification, partial match to bank evidence and approver revoked mid-operation.
- **Acceptance:** Concurrent verification creates at most one Payment per claim; reject cannot coexist with successful verification; unauthorized roles and staff self-approval fail; verifier/time are recorded. Duplicate warning does not alone approve/reject funds and cannot replace bank-event duplicate review. A transfer dated January 31 and verified February 2 belongs to February verification-basis collections, while its January transfer date remains available for reconciliation.

### PAY-003 — Payment allocation and receipt [P0]

- **Status/dependencies:** SELECTED WORKING DEFAULTS O-009/O-010/GAP-003/GAP-006: visible auditable unapplied funds, per-org verified-payment PDF receipts, one plaza per payment and no out-of-scope receipt disclosure. Allocation, numbering/reissue, receipt projection and invoice grouping mechanics remain BLOCKED.
- **Actors:** Authorized Owner/Accountant; Tenant downloads own receipt.
- **Preconditions:** Verified funds, eligible same-organization debtor/invoices and available payment balance.
- **Behavior:** Allocate all or part of funds only within the payment's owning plaza and authorized debtor/resource boundaries; invoice grouping remains unresolved. Issue verified-payment PDF receipts with per-organization references, subject to full resource-scope checks. Show unallocated remainder separately and audit its changes. A representative's access to one allocation does not authorize a full receipt exposing other financial records.
- **Edge cases:** Multiple invoices/plazas, zero available funds, concurrent allocations, PDF generation failure and receipt retry.
- **Acceptance:** Total effective allocations never exceed available verified funds; invoice due never becomes negative; pending/rejected claims yield no final receipt; download is authorized; retry does not create another payment or receipt reference; generation failure is recoverable without re-verification.

### PAY-004 — Corrective reversal [P0]

- **Status/dependencies:** SELECTED WORKING DEFAULT O-015 sensitive approval gates and GAP-004 preserved history/corrections/reversals under PostgreSQL transaction/concurrency protection. Partial/full reversal, allocation effects, refund handling and report restatement remain BLOCKED under O-009/GAP-002/GAP-004.
- **Actors:** Owner/Accountant subject to approval policy.
- **Preconditions:** Existing verified payment, explicit reason and allowed reversal operation.
- **Behavior:** Append linked correction records, reverse affected allocation effects atomically and retain original payment/receipt history. A correction reversal is not automatically a bank refund.
- **Edge cases:** Retry, partial reversal, already reversed payment, concurrent allocation and closed reporting period.
- **Acceptance:** Original records remain identifiable; receipt lookup discloses reversal/correction; balances and collection reports reconcile to effective records; duplicate reversal cannot deduct twice; unsupported partial/refund behavior is not inferred.

### EXP-001 — Operating expenses [P0]

- **Status/dependencies:** BASELINE recorded expenses; O-015 selects sensitive-adjustment approval gates. Exact approvers and expense recognition/cutoff rules remain BLOCKED under GAP-002.
- **Actors:** Owner, Manager, Accountant within scope.
- **Preconditions:** Plaza, category, business date, amount, vendor/description and optional evidence.
- **Behavior:** Record categorized operating expenses separately from collections; preserve corrections with actor/reason/history.
- **Edge cases:** Future/backdated expense, duplicate entry, correction after export and wrong-plaza evidence.
- **Acceptance:** Invalid or foreign-plaza references fail; filtered totals equal included effective expense records; correction is auditable and does not silently erase the original; expense reporting is labeled recorded expenses, not inferred cash payments/profit.

## Reports and data movement

### RPT-001 — Owner overview [P0]

- **Status/dependencies:** SELECTED WORKING DEFAULTS GAP-001/GAP-002/GAP-003/GAP-005: distinguish opening arrears/credits, verification-timestamp collections, one-plaza payments and independent occupancy/availability. Report restatement/ageing/rate denominator and opening-credit mechanics remain BLOCKED.
- **Actors:** Owner; Manager/Accountant within permitted report scope.
- **Preconditions:** Selected organization/plaza(s), period or as-of cutoff and approved metric definitions.
- **Behavior:** Display invoiced obligations, verified collections, outstanding debt, occupancy and recorded expenses with drill-down and explicit date basis.
- **Edge cases:** No data, unapplied funds, pending claims, reversals after period end and restricted plaza access.
- **Acceptance:** Each total equals its detail records under the same cutoff; pending claims excluded from collections; unpaid is not automatically overdue; currency/timezone/date basis shown; totals cannot reveal another scope by aggregation.

### RPT-002 — Operational reports [P0]

- **Status/dependencies:** Verification-timestamp collections (GAP-002) and 30-day expiry read/export grace (O-012) selected. Ageing, historical correction cutoffs, exact lifecycle permissions and broader report definitions remain BLOCKED.
- **Actors:** Owner, Manager, Accountant; Tenant only own permitted records.
- **Preconditions:** Authorized filter set, pagination and approved ageing/date definitions.
- **Behavior:** Provide aged receivables, invoice status, payment ledger and expenses by category; export using identical calculation rules.
- **Edge cases:** Due-today debt, timezone boundary, revoked access during export, large result and concurrent transaction changes.
- **Acceptance:** Screen/export totals match for the same data snapshot/cutoff; output identifies filters and generation time; tenant export cannot include other accounts; inaccessible rows are excluded from both details and totals.

### IMP-001 — Data import/export [P0]

- **Status/dependencies:** SELECTED WORKING DEFAULT GAP-001 explicitly adds auditable opening arrears/credits to v1.0 imports; O-005 excludes deposits. Cutover/provenance, credit allocation, approval, deduplication and commit policies remain BLOCKED under GAP-001/GAP-009; retention review under O-013.
- **Actors:** Authorized staff under provisional import permissions; permitted report/register readers export.
- **Preconditions:** Selected organization/plaza, allowed template, validated access and approved commit policy.
- **Behavior:** Parse unit/tenant/lease CSV and narrowly authorized opening arrears/credits into staged preview; validate scope, provenance and reconciliation totals, show row-level errors, commit explicitly and audit result. Opening entries are distinct from new current-period invoices/verified cash and do not create newly verified-payment receipts. No deposit accounting or full historical replay is added. Export permitted registers/reports with scope preserved.
- **Edge cases:** Duplicate upload/row, malformed encoding, invalid lease dates, changed underlying data after preview, formula-like CSV cells and oversized files.
- **Acceptance:** Preview creates no operational records; invalid rows identify row/field/reason; commit revalidates scope/references/provenance; retries cannot silently duplicate records; exports neutralize spreadsheet-formula injection; inserted/rejected counts and money totals reconcile. A ₦120,000 opening debt increases opening outstanding without current-period new billing/collections/receipt; a ₦30,000 opening credit is separately auditable, never a fabricated current verified payment. Exact allocation/ageing, duplicate matching and atomic versus partial commit remain blocked before implementation.

## Tenant mobile PWA

### PWA-001 — Mobile-first tenant portal [P0]

- **Status/dependencies:** SELECTED WORKING DEFAULTS O-014/O-016/O-018/GAP-006: tenant phone OTP, optional email/recovery, authorized summaries, isolated business records and explicit per-resource grants. Provider/recovery and grant-lifecycle/field details remain BLOCKED.
- **Actors:** Tenant.
- **Preconditions:** Authenticated representative with explicit resource grants.
- **Behavior:** Show assigned shops, approved lease summary, issued invoices and current outstanding balances; provide shop/context selection.
- **Edge cases:** Multiple shops, no current lease, revoked grant, large currency values and session expiry.
- **Acceptance:** Main tasks fit 360px viewport without horizontal scrolling; changing IDs reveals no other tenant data; shop switching changes context explicitly; confidential attachments are absent unless permitted; empty/revoked states do not show stale former-account data.

### PWA-002 — Verified payment history and receipts [P0]

- **Status/dependencies:** SELECTED WORKING DEFAULT O-010 verified-payment PDF receipts with per-org references; GAP-006 prohibits out-of-scope financial disclosure. Receipt projection/reissue and grant-lifecycle details remain BLOCKED.
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

- **Status/dependencies:** BASELINE atomic audit; selected no-self-approval and sensitive-action gates (O-008/O-015). Retention/privacy review and exceptional support projection remain BLOCKED under O-013/GAP-010.
- **Actors:** System records events; Owner and permitted staff read filtered history.
- **Preconditions:** Sensitive mutation/financial transition with actor or attributable job identity.
- **Behavior:** Capture actor, organization/scope, action, resource, timestamp, reason and safe change references. Commit required audit together with financial changes.
- **Edge cases:** Failed transaction, deactivated actor, background job, audit write failure and sensitive payloads.
- **Acceptance:** Verification, void, reversal and expense correction have linked history; failed financial transaction creates no successful event; required audit failure rolls back financial mutation; application users cannot rewrite audit history; credentials/evidence content are not copied into logs.

### OPS-001 — Backup, restore and monitoring [P0]

- **Status/dependencies:** BASELINE restore/monitoring; O-013 selects mandatory privacy/legal approval before production, not validated windows. Targets/providers remain BLOCKED under GAP-007/GAP-011; no production connection authorized.
- **Actors:** Authorized operations staff.
- **Preconditions:** Approved infrastructure, backup targets and non-production restore environment.
- **Behavior:** Document database/private-file backup and restoration, monitor failures and maintain incident/rollback/reconciliation procedures.
- **Edge cases:** Database restored without corresponding files, missing keys/configuration, failed backup and accidental restore into production.
- **Acceptance:** Demonstrated non-production restore recovers linked database/files; verify financial totals and access controls afterward; alert test reaches designated operator; measured recovery meets approved objectives. Destructive database/infrastructure actions require prior human approval.

### OPS-002 — Protected file handling [P0]

- **Status/dependencies:** BASELINE private files; O-016/GAP-006 select summaries and resource-scoped financial disclosure, confidential attachments hidden by default. Retention review and upload/visibility details remain BLOCKED/PROVISIONAL under O-013/GAP-009.
- **Actors:** Authorized staff and Tenant for permitted attachments.
- **Preconditions:** Private asset belongs to same organization and an authorized parent record; attachment class permits this viewer.
- **Behavior:** Validate upload type/size, keep object storage private and authorize download. Proposed default is application-mediated streaming; any signed URL must be short-lived and must not bypass required cross-user controls.
- **Edge cases:** MIME spoofing, malicious files, orphan upload, copied URL, revoked membership and expired link.
- **Acceptance:** Unauthenticated/foreign-user file access fails; copied application URL requires fresh authorization; no permanent public object URL exists; invalid uploads fail safely; attachment access does not follow parent access if confidential class is excluded.

## State-machine foundation (selected principles, unresolved detailed transitions)

| Aggregate | Baseline transition intent | Unresolved branch |
|---|---|---|
| Lease | Exclusive active shop/date-range agreement, actual landlord/agent; historical renewal/termination | Exact statuses, date bounds, renewal representation and backdating: O-002–O-004 |
| Invoice | Draft → Issued; issued correction preserves original | Void with allocations, credits and approval: O-015, GAP-004 |
| PaymentClaim | Immutable submission; verify/reject or eligible cancel then resubmit; verification creates Payment; staff self-approval prohibited | Cancellation/rejection authority, eligible states and review escalation: O-007/O-008 |
| Verified Payment | One plaza; verification-timestamp collections; allocated/unapplied funds; linked reversal preserves history | Partial reversal, refund and actual combined-bank-transfer handling: O-009, GAP-003/GAP-004; cross-plaza allocation disallowed |
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

This SRS contains the complete 30-requirement PRD functional set (29 P0, one P1), incorporating selected working defaults and the explicit IMP-001 opening-arrears/credit addition. It is not an implemented, jointly founder-signed or legally validated final specification. Field limits, provider contracts and residual policy-dependent expected values require subsequent review. No application tests are claimed executed here.
