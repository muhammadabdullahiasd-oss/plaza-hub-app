# Open questions and implementation gates

Status: DRAFT, 2026-11-05. All questions below are unresolved. This register does not approve any default. Source: [DECISIONS.md](DECISIONS.md), [PRD.md](PRD.md) and Task 001 assessment. Existing O identifiers remain unchanged. New GAP identifiers are a separate question namespace.

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
