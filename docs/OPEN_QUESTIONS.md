# Open questions and implementation gates

Status: updated 2026-11-05 after owner-delegated selection. Selected portions are **SELECTED WORKING DEFAULT**, not both-founders sign-off or legal/privacy validation. [DECISIONS](DECISIONS.md#current-selected-working-defaults) records authority, date, rationale and requirement impact. This register separates remaining questions from selected principles. [Original register](history/pre-task004-2026-11-05/docs/OPEN_QUESTIONS.md) is preserved verbatim.

## Current residual questions

| ID | Selected boundary | Remaining question / gate |
|---|---|---|
| O-001 | Actual landlord/authorized agent distinct from SaaS organization | Contracting-party fields/evidence/document review before lease implementation. |
| O-002 | One exclusive active lease per shop/date range | Exact endpoint/renewal semantics and transactional overlap constraint. |
| O-003 | Monthly/quarterly/annual; per-lease due dates | First bill, anchor, month-end, finite intervals and due cutoff before scheduling. |
| O-004 | Audited manual adjustments; no automatic proration | Amount validation and approval/allocation effects before corrections. |
| O-005 | Deposits deferred past v1.0 | Explicit unsupported-data handoff; never count deposits as opening rent credits. |
| O-006 | Fixed/authorized manual charges | Input schema, occurrence identity and authorizers before charge issuance. |
| O-007 | Submitted claims immutable; cancel/reject/resubmit | Cancellation actor/state, replacement linkage and races before claim transitions. |
| O-008 | Authorized owners/accountants verify; no staff self-approval | Rejection/reversal roles and legitimate escalation; absence of approver never authorizes self-approval. |
| O-009 | Visible auditable unapplied funds | Allocation order, refunds and opening-credit spending/reversal rules. |
| O-010 | Per-org references; verified-payment PDF receipts | Number format/multiplicity/reissue and legal/branding/signature fields. |
| O-011 | Subscribing org payer; plaza/size tiers; manual provision | Prices/thresholds/terms; automated subscriptions still deferred. |
| O-012 | 30-day read/export grace; restricted staff operations afterward | Day boundary, grace writes, post-grace allowlist, tenants and reinstatement. |
| O-013 | Privacy/legal review required before production | Actual proposed export/retention windows not supplied; no deletion schedule authorized. |
| O-014 | Staff email/password + MFA; tenant phone OTP + optional email/recovery | MFA factors, OTP provider/expiry/rate limits, phone reassignment, recovery and mixed-role step-up. |
| O-015 | Sensitive adjustment/reversal/refund approval gates | Sensitivity classification, maker/checker/approver matrix, thresholds; refund feature itself not authorized. |
| O-016 | Authorized summaries; confidential files hidden by default | Field/file allowlists and receipt projections before portal delivery. |
| O-017 | Reviewed manual tax lines; no automated tax engine | Reviewer/document fields/withholding mechanics; no legal or tax validation implied. |
| O-018 | Shared login, isolated business records | Safe account linking/recovery and explicit membership/resource grants. |

## Current gap mapping

| ID | Mapping status | Remaining gate |
|---|---|---|
| GAP-001 | SELECTED WORKING DEFAULT — PARTIAL: opening arrears/credits added narrowly to IMP-001 | Cutover/provenance, due-date handling, credit allocation, approval, atomicity and deduplication; no fake current collection/receipt. |
| GAP-002 | SELECTED WORKING DEFAULT — PARTIAL: verification timestamp collections, transfer dates retained | Reversal/backdating, historical report restatement, expense dates and ageing buckets. |
| GAP-003 | SELECTED WORKING DEFAULT — PARTIAL: one plaza per payment | Real multi-plaza bank transfer handling, duplicate evidence and debtor/credit attribution. |
| GAP-004 | SELECTED WORKING DEFAULT — PARTIAL: immutable issued history, corrections/reversals, PostgreSQL protection | Allocated invoice correction/void, partial/full reversal, reallocation and refund accounting. |
| GAP-005 | SELECTED WORKING DEFAULT — PARTIAL: independent occupancy/physical availability | Overlapping dimension display, rate denominator, activation and retirement rules. |
| GAP-006 | SELECTED WORKING DEFAULT — PARTIAL: per-resource grants and scoped receipts | Grant lifecycle/administrators, representative multiplicity, renewal/history access and safe receipt delivery. |
| GAP-007 | UNMAPPED — OPEN | Pilot scale, RPO/RTO, backup cadence, support/reconciliation/incident owners. |
| GAP-008 | UNMAPPED — OPEN | Invoice consolidation, lease/plaza cardinality and line due dates; do not infer from payment scope. |
| GAP-009 | UNMAPPED — OPEN | Import atomicity/merge/duplicates/limits, invitation expiry and file validation limits. |
| GAP-010 | UNMAPPED — OPEN | Exceptional support authorization/expiry/revocation; disable path; routine platform finance access denied. |
| GAP-011 | UNMAPPED — OPEN | Auth/MFA/OTP, hosting, private storage, email/jobs, budget/residency/recovery; no production connection authorized. |
| GAP-012 | UNMAPPED — OPEN / P1 unchanged | Contact-request roles/workflow; must not bypass phone/account recovery. |

The missing referenced Task 004 scope is a task-input blocker, not a renumbered product decision. Reconciliation is authorized; implementation deliverables must be recovered from that brief. No Task 005 work, lease/billing/payment/subscription workflows, deployment, push or production connections are authorized here. Numerical legal/privacy windows and unspecified workshop options are not selected by delegation alone.

## Historical question register (pre-selection)

The following original register is retained for traceability. Its broad unresolved labels describe the old state; the current tables above govern what remains open. All O/GAP identifiers retain their original references and meanings.

## Existing open decisions

All O-001–O-018 refer to the original entries in [DECISIONS.md, Open decisions for SRS workshop](DECISIONS.md#open-decisions-for-srs-workshop). Suggested defaults remain only suggestions; consult the original table for their wording.

| ID | Founder answer required | Gate / affected requirements |
|---|---|---|
| O-001 | Who contracts with the shop tenant: owner or managing agent? What party details belong on leases and invoices? | BLOCKED: final lease/party model; TEN-001, LSE-001, BIL-001 |
| O-002 | One exclusive lease per unit, or shared/co-tenant arrangements? | BLOCKED: lease cardinality and overlap constraints; LSE-001–LSE-003 |
| O-003 | Allowed cadence, first bill, due-date rule, period boundaries and month-end handling? | BLOCKED: billing periods and schedule; LSE-001, BIL-001 |
| O-004 | Mid-period move-in/out proration and authorized manual adjustments? | BLOCKED: calculation/correction policy; LSE-002, BIL-001, BIL-003 |
| O-005 | Can security deposits remain out of v1.0? How will pilot deposit records be handled? | BLOCKED: financial scope sign-off; BIL-001, RPT-001, IMP-001 |
| O-006 | Exact generator/electricity/service-charge allocation inputs and approvers? | BLOCKED: charge rule semantics; BIL-002 |
| O-007 | Can a submitted claim be edited, cancelled or replaced, and by whom? | BLOCKED: claim state transitions; PAY-001 |
| O-008 | Who verifies/rejects/reverses, and when is self-verification prohibited? What if only one approver exists? | BLOCKED: financial approval matrix; PAY-002, PAY-004 |
| O-009 | How are unapplied funds allocated, refunded and reversed? What is allowed in v1.0? | BLOCKED: credit/refund and correction model; BIL-004, PAY-003–PAY-004 |
| O-010 | Required invoice/receipt fields, numbering scope, branding and signatures? | BLOCKED: final issued-document contract; BIL-003, PAY-003 |
| O-011 | Who pays SaaS fees and on what pricing basis? | PROVISIONAL: commercial onboarding; automated subscriptions remain outside v1.0 |
| O-012 | What access remains after expiry/suspension, for staff and tenants? | BLOCKED: lifecycle access policy before live onboarding; AUTH-002, RPT-002, PWA-001 |
| O-013 | Retention, cancellation export, deletion, document and backup retention? | BLOCKED: production privacy/retention policy; OPS-001–OPS-002, IMP-001 |
| O-014 | Tenant authentication, invitation and recovery when users lack email? | BLOCKED: final identity/onboarding design; AUTH-001, PWA-001 |
| O-015 | Which invoice issues, corrections and expense changes require owner approval? | BLOCKED: approval transitions; BIL-003, EXP-001 |
| O-016 | Which rent/expiry terms and confidential attachments may tenant representatives see? | BLOCKED: final portal/document projection; PWA-001, OPS-002 |
| O-017 | Approved treatment and fields for tax, VAT and withholding; who reviews these? | BLOCKED: final financial document/calculation scope; BIL-001–BIL-003, PAY-003 |
| O-018 | How may a login participate across organizations while business tenant records stay separate? | BLOCKED: final membership/representative model; AUTH-002–AUTH-003, TEN-001 |

## Additional gaps (not new approved decisions)

| ID | Question and options to settle | Related decisions / requirements | Gate |
|---|---|---|---|
| GAP-001 | How are opening arrears, credits, historical receipts and deposits onboarded? Separate opening entries or historical migration? Who signs off reconciliation? | O-005, O-009; IMP-001, RPT-001 | BLOCKED: financial migration model and pilot reconciliation |
| GAP-002 | Do collections use transfer, verification or accounting-effective date? Are backdated corrections permitted? How are historical reports restated and ageing buckets defined? | O-003, O-009; RPT-001–RPT-002 | BLOCKED: financial dates, cutoffs and reporting contracts |
| GAP-003 | Can one payment cover multiple plazas? How are unapplied funds attributed and which plaza-scoped staff may see them? | O-009; PAY-003, AUTH-002, RPT-001 | BLOCKED: payment ownership, scope and plaza reports |
| GAP-004 | Can allocated/partly paid invoices be voided? Must allocations be reversed first? Are partial payment reversals and reallocation allowed? | O-008, O-009, O-015; BIL-003, PAY-004 | BLOCKED: correction transactions and invariants |
| GAP-005 | How should occupied/out-of-service overlap affect counts and occupancy denominator? Which statuses block a new lease? | O-002; PLZ-002, LSE-003 | BLOCKED: occupancy calculation policy |
| GAP-006 | May several representatives act for one shop tenant? Are grants tenant-wide or lease-specific? Who invites/removes representatives, including former occupants? | O-014, O-016, O-018; TEN-001, PWA-001 | BLOCKED: representative cardinality and access grants |
| GAP-007 | Who owns support, reconciliation and incidents? What pilot size, recovery objectives, backup intervals and performance dataset are approved? | O-013; OPS-001, RPT-001 | BLOCKED: production operational acceptance; PROVISIONAL: capacity targets |
| GAP-008 | One invoice per lease, or consolidated multi-unit/plaza invoices? How are line-level due dates handled? | O-003, O-010; BIL-001–BIL-003 | BLOCKED: final invoice relationships and due-status semantics |
| GAP-009 | What expired/duplicate invite rules, upload types/sizes, CSV limits, import atomicity and duplicate-row matching are required? | O-013, O-014; AUTH-004, IMP-001, OPS-002 | PROVISIONAL: engineering limits; BLOCKED: import overwrite/merge behavior |
| GAP-010 | What customer authorization, approver, duration, revocation and review process permits exceptional support access? | O-013; AUTH-003, AUD-001 | BLOCKED: exceptional support access. Routine access remains prohibited |
| GAP-011 | Which hosting, authentication, private storage, email and job execution providers fit budget, residency and recovery needs? | O-013, O-014; AUTH-001, OPS-001–OPS-002 | PROVISIONAL: technical selection; no provider assumed approved |
| GAP-012 | Which tenants may submit contact-change requests and which staff approve them? | O-015, O-016; PWA-005 | PROVISIONAL: optional P1 workflow; not a P0 release blocker |

## Order of resolution

1. **Database policy workshop:** O-001–O-004, O-018 and GAP-003, GAP-005, GAP-006, GAP-008. Establish parties, identities, cardinalities, date boundaries and ownership before final schema/migrations.
2. **Finance workshop:** O-005–O-010, O-015, O-017 and GAP-001–GAP-004, GAP-008. Approve worked examples for issuance, allocation, surplus, reversal, corrections and reports before financial implementation.
3. **Access and pilot readiness:** O-012–O-014, O-016 and GAP-007, GAP-009–GAP-011. Agree lifecycle access, privacy, operational targets and service choices before live onboarding. Exceptional support stays disabled until GAP-010 is resolved.
4. **Commercial/P1 follow-up:** O-011 and GAP-012. Do not add SaaS subscription automation or P1 delivery as an implicit MVP requirement.

For each answer, founders record decision owner, date, exact rule, accepted examples, scope and affected requirement IDs in DECISIONS.md. Update affected documents together. If the answer changes a PRD requirement, record that scope change explicitly. Neither elapsed time nor this document's suggested order constitutes approval.
