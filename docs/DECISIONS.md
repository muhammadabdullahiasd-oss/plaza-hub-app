# PlazaHub — Decisions, Assumptions and Open Business Rules

> **Document revision:** 0.2 | **Updated:** 2026-11-05, Task 004 reconciliation  
> Authority: product-owner-delegated selection conveyed in the Task 004 authorization. **SELECTED WORKING DEFAULT** is not both-founders sign-off, legal/privacy validation or production approval. Original revision 0.1 is preserved in [history](history/pre-task004-2026-11-05/docs/DECISIONS.md).

## Current selected working defaults

Each O row below has status **SELECTED WORKING DEFAULT**, selection date **2026-11-05**, and decision owner **product owner through delegated technical orchestration**. The implementer records that instruction; the implementer does not claim to be either founder or to have independently obtained their signatures. The rationale is the owner's delegated v1.0 direction, with the module-specific purpose stated per row. Select only the stated rule: workshop options, numerical examples and unspecified mechanics are not approved by association.

| ID | Selected rule | Owner-delegated rationale | Impacted requirements | Residual gate |
|---|---|---|---|---|
| O-001 | Store actual contracting landlord or authorized agent on the lease, distinct from managing SaaS organization. | Accurate contracting identity without changing the organization isolation boundary. | TEN-001, LSE-001, BIL-001 | Party fields, evidence of agency and legal document review. |
| O-002 | One exclusive active lease per shop/date range. | Unambiguous shop liability and overlap protection. | LSE-001, LSE-002, LSE-003, TEN-001 | Endpoint semantics, renewal representation and final database constraint implementation. |
| O-003 | Monthly, quarterly or annual billing with per-lease due dates. | Support selected pilot billing frequencies without a general rule engine. | LSE-001, BIL-001, BIL-003, RPT-002 | First bill, anniversary/calendar anchor, month-end handling, inclusive/exclusive dates and due-day cutoff remain unselected. |
| O-004 | No automatic proration; audited manual adjustments. | Preserve inspectable financial changes without inventing calculation conventions. | LSE-002, BIL-001, BIL-003, BIL-004 | Adjustment request/approval roles, signs and allocation effects. |
| O-005 | Deposit accounting deferred beyond v1.0. | Keep the owner-selected MVP boundary. | BIL-001, RPT-001, IMP-001 | Explicitly reject/classify unsupported deposit import rows; do not disguise deposits as rent credits. |
| O-006 | Fixed and authorized manually allocated service charges. | Make staff-entered allocation visible and accountable. | BIL-002, AUD-001 | Exact charge inputs, occurrence identity and approval authority. |
| O-007 | Submitted payment claims immutable; cancel or reject and resubmit to correct. | Preserve evidence and review lineage. | PAY-001, PAY-002, PWA-002, AUD-001 | Who cancels, eligible states and race handling; no editing verified claims. |
| O-008 | Only authorized owners/accountants verify payments; staff cannot self-approve submitted transactions. | Independent accountable verification of manual transfers. | AUTH-002, PAY-002, PAY-004, AUD-001 | Exact rejection/reversal authority and staffing escalation; no self-approval fallback inferred. |
| O-009 | Unapplied funds remain visible and auditable. | Preserve real surplus while supporting existing partial-payment requirements. | BIL-004, PAY-003, PAY-004, RPT-001 | Allocation order, refund eligibility and cash/refund reconciliation remain open. |
| O-010 | Per-organization receipt references; verified-payment PDF receipts. | Traceable receipts for verified funds only. | BIL-003, PAY-003, PAY-004, PWA-002 | Sequence format/gaps, multiplicity/reissue, branding/signatures and reviewed legal fields. |
| O-011 | Charge subscribing organizations by plaza/size tiers; manually provision early customers. | Owner-selected commercial basis without automated subscription scope. | PLZ-001 (onboarding context); no new automated subscription requirement | Actual prices, tier thresholds and commercial terms; no subscription workflow in Task 004. |
| O-012 | 30-day read/export grace after subscription expiry, then restricted staff operations. | Defined grace interval without immediate loss of data portability. | AUTH-002, RPT-002, PWA-001, IMP-001 | Exact expiry/day boundary, write restrictions, post-grace allowlist, tenant access and reinstatement need explicit rules. |
| O-013 | Proposed cancellation export/retention windows require privacy/legal approval before production. | Preserve a mandatory production review gate rather than invent compliance. | OPS-001, OPS-002, IMP-001, AUD-001 | No numerical cancellation export or retention window has been supplied or validated. Subscription grace is not a deletion/retention policy. |
| O-014 | Staff email/password plus MFA; tenants phone OTP, optional email and secure recovery. | Owner-selected differentiated staff/tenant authentication. | AUTH-001, AUTH-004, AUTH-002, PWA-001 | MFA method, OTP provider/limits, recovery, phone reassignment and multi-role step-up rules; optional email is not an approved bypass. |
| O-015 | Approval gates for sensitive financial adjustments, reversals and refunds. | Prevent unilateral sensitive financial changes. | AUTH-002, BIL-003, PAY-004, EXP-001, AUD-001 | Sensitive-action classification, approver matrix, thresholds and refund scope remain open; gate does not authorize a new refund workflow. |
| O-016 | Authorized lease summaries in portal; confidential attachments hidden by default. | Useful tenant context with least-privilege disclosure. | TEN-001, PWA-001, PWA-002, OPS-002 | Field/class allowlists, explicit attachment exceptions and receipt projections. |
| O-017 | No automated tax engine in v1.0; reviewed manual tax lines only. | Constrained financial scope with explicit review of tax inputs. | BIL-001, BIL-002, BIL-003, PAY-003 | Reviewer, line/document fields and withholding treatment; no tax rates or compliance claim selected. |
| O-018 | Shared login identities across organizations; isolated organization-owned business records. | Reusable identity without sharing tenant business data or role scope. | AUTH-002, AUTH-003, TEN-001 | Identity linking/recovery and grants remain explicit; no cross-context privilege union. |

## Additional gap reconciliation

Original references: [workshop](DECISION_WORKSHOP.md) and [OPEN_QUESTIONS](OPEN_QUESTIONS.md). For selected portions, date/owner/rationale have the same delegated authority as above. **PARTIAL** means only the named principle was selected. **UNMAPPED** means the authorization did not choose that gap's policy; it remains open, not silently accepted from the workshop.

| Gap | Status / selected portion | Owner-delegated rationale and impacted requirements | Remaining implementation question |
|---|---|---|---|
| GAP-001 | SELECTED WORKING DEFAULT — PARTIAL: auditable opening arrears and credits are a narrow v1.0 import addition. | Reconcile migrated account starts; IMP-001, BIL-004, RPT-001, RPT-002, AUD-001. | Cutover/provenance, ageing/unknown dates, opening-credit allocation semantics, sign-off, duplicate matching and atomicity. Deposits/full historical ledger replay not added. |
| GAP-002 | SELECTED WORKING DEFAULT — PARTIAL: verified collections use verification timestamps; bank-transfer dates retained separately. | Reproducible verified collection basis; PAY-002, RPT-001, RPT-002. | Reversal posting/backdating, historic restatement, expense recognition, ageing buckets and report cutoff semantics. |
| GAP-003 | SELECTED WORKING DEFAULT — PARTIAL: one payment belongs to one plaza in v1.0. | Bound payment ownership and authorized reporting; AUTH-002, PAY-003, RPT-001, PWA-002. | Actual bank transfers covering multiple plazas, duplicate bank-event review, debtor eligibility and unapplied attribution; no silent split/double count. |
| GAP-004 | SELECTED WORKING DEFAULT — PARTIAL: preserve issued invoices; corrections/reversals with PostgreSQL transaction and concurrency protection. | Preserve auditable and consistent financial state; BIL-003, BIL-004, PAY-004, AUD-001. | Allocated invoice correction, reallocation, partial/full reversals, refund semantics and approval execution boundaries. |
| GAP-005 | SELECTED WORKING DEFAULT — PARTIAL: occupancy and physical availability modeled independently. | Avoid hiding lease occupancy behind operational status; PLZ-002, LSE-001, LSE-003, RPT-001. | Joint display, occupancy denominator, retirement/activation restrictions; workshop occupied-precedence headline counts not selected. |
| GAP-006 | SELECTED WORKING DEFAULT — PARTIAL: explicit per-resource representative grants; receipts cannot reveal out-of-scope financial records. | Least-privilege tenant access; AUTH-002, AUTH-003, TEN-001, PWA-001, PWA-002, OPS-002. | Grant administration, representative multiplicity, renewal/expiry access and complete-versus-scoped receipt delivery; no account-wide grant inferred. |
| GAP-007 | UNMAPPED — OPEN | No pilot operational targets selected; OPS-001, RPT-001. | Named incident/support/reconciliation owners, dataset, RPO/RTO and backup cadence. |
| GAP-008 | UNMAPPED — OPEN | One-plaza payment does not choose invoice consolidation; BIL-001, BIL-002, BIL-003, PAY-003. | One/multiple leases per invoice, invoice plaza scope, line due dates and authorized projections. |
| GAP-009 | UNMAPPED — OPEN (opening import now in scope) | Import/invite/upload mechanics were not selected; AUTH-004, IMP-001, OPS-002. | Atomic/partial commit, duplicates/merge, limits, invite expiry/replay and upload handling. |
| GAP-010 | UNMAPPED — OPEN; exceptional access disabled | No support bypass selected; AUTH-003, AUD-001, OPS-002. | Customer approval, expiry, permitted actions, revocation and review before exceptional access. Routine platform-admin financial access prohibited. |
| GAP-011 | UNMAPPED — OPEN (auth methods constrain choice) | No infrastructure/provider selected; AUTH-001, OPS-001, OPS-002. | MFA/OTP/auth, hosting/storage/email/jobs, budgets, recovery and residency evaluation; no production connections authorized. |
| GAP-012 | UNMAPPED — OPEN; P1 unchanged | No contact-request workflow selected; PWA-005. | Submit/review roles, conflicts, priority; phone/email changes must not bypass authentication recovery. |

## Contradictions, limits and unselected workshop details

- O-014 supersedes the workshop email-first tenant recommendation and adds staff MFA. A shared identity acting as staff cannot use a weaker tenant login to obtain staff access; enforcement details still require design review.
- GAP-001 resolves the workshop opening-import scope conflict, specifically for auditable opening arrears/credits. It does not authorize deposits, arbitrary historical replay or current-period cash receipts for imported credits.
- GAP-005 supersedes the workshop recommended disjoint headline precedence/75% occupancy example. Independent dimensions may overlap; the denominator remains unselected.
- O-008 strengthens the original “self-verification discouraged” wording into prohibition for staff-submitted transactions. Do not invent a sole-owner exception.
- O-012 supplies 30 days, not post-grace permissions or a retention/deletion window. O-013 remains production-blocking and has no legal/privacy validation.
- O-015 requires approval gates, not the workshop's specific “another Owner approves every correction” staffing model, monetary thresholds or permission to implement refunds.
- Partial payments, claim/verified-payment separation, exact money, idempotency, private files and no routine platform-admin financial access remain PRD invariants. Critical finance additionally requires PostgreSQL transactional/concurrency protection.
- Due-date anchoring/clamping, exclusive interval representation, receipt numbering examples, one-lease-per-invoice, opening-credit mechanics and all other unselected workshop details remain proposals. Do not execute examples as approved test oracles for those details.
- The referenced “previously supplied Task 004 application foundation scope” was not found in the available conversation or repository on this date. Reconciliation is authorized and proceeds; the exact scaffold deliverables are requested separately rather than invented. Task 004 excludes lease/billing/payment/subscription business workflows, deployment, push and production connections. Task 005 is not authorized.

## Original revision 0.1 record (historical)

The following source text and IDs are retained as the original record. Its open/default wording describes the pre-selection state, not current authority. Use the current selected tables above and residual gates in OPEN_QUESTIONS for ongoing work.

## Accepted working decisions (can be revisited)

| ID | Working decision | Rationale |
|---|---|---|
| D-001 | Nigeria-first, NGN-only v1.0 | Keeps currency, billing and reporting simple |
| D-002 | Web SaaS plus installable tenant PWA | Single product and codebase for mobile and desktop |
| D-003 | Next.js + TypeScript + PostgreSQL + Prisma | Shared language, relational finance model |
| D-004 | Modular monolith initially | Lower integration and operations cost for two founders |
| D-005 | Manual bank-transfer verification in v1.0 | Avoids premature gateway scope while preserving accounting integrity |
| D-006 | Fixed or staff-entered service charges in v1.0 | Supports real plaza charges without rule-engine complexity |
| D-007 | Self-serve SaaS billing deferred to v2.0 | Manual provisioning works for early customers |
| D-008 | Maintenance ticket management deferred to v1.1 | Keeps v1.0 centered on reliable finance workflows |
| D-009 | Shop tenant portal is mobile-first and browser-usable | Installation must never be a prerequisite |

## Open decisions for SRS workshop

Use `Proposed default` only until founders explicitly accept/change it.

| ID | Decision to settle | Proposed default | Consequence if changed |
|---|---|---|---|
| O-001 | Who legally contracts with plaza tenants: owner or managing agent? | Customer org owns/controls each lease record | Lease parties, documents, permissions |
| O-002 | Can a physical shop have multiple co-tenants/leases? | One exclusive active lease per unit/date range | Occupancy and overlap rules |
| O-003 | Billing cadence and first invoice due date? | Monthly/quarterly/annual, due per lease rule | Invoice generator and prorations |
| O-004 | Proration on mid-period move-in/out? | No automatic proration; authorized manual adjustment | Calculation engine complexity |
| O-005 | Deposit/security deposit handling? | Record separately as a liability in a later finance enhancement; not v1 invoice revenue | Ledger scope, reports |
| O-006 | How are generator/electricity charges apportioned? | Fixed amount or manual allocation per shop in v1 | Invoice inputs and validations |
| O-007 | Can tenants edit payment claims after submission? | No; cancel/re-submit or staff reject | Audit and fraud controls |
| O-008 | Who verifies bank transfers and reversals? | Accountants/owners; self-verification discouraged with audit | Separation of duties |
| O-009 | Treatment of overpayments/unallocated cash? | Hold as unapplied credit until staff allocation/refund workflow | Financial balances and receipts |
| O-010 | Receipt numbering, branding and signatures? | Per-org serial reference and organization header; digital PDF | Receipt generation |
| O-011 | Who is charged SaaS fees? | Owner/managing organization, per plaza/size tier | Subscription model |
| O-012 | Access after organization subscription expiry? | Restricted staff editing with safeguarded read/export grace period | Billing and support policy |
| O-013 | Data retention after customer cancellation? | Document policy before production launch; export on request | Privacy and backups |
| O-014 | Tenant login method? | Email/password initially; support phone-centric invite flows later | Accessibility and contact verification |
| O-015 | Should owners approve all invoices/expense edits? | Restrict sensitive adjustments, not ordinary drafts | Workflow speed and controls |
| O-016 | Should tenants see expiry/lease rent terms? | Show summary, not full confidential attachments by default | Portal UX / permissions |
| O-017 | Support for tax/VAT/withholding? | No automated tax computation in v1.0; explicit line items only if approved | Legal/accounting review needed |
| O-018 | Can customer organizations manage a shared tenant identity across organizations? | No shared business data; identities may have separate memberships | Privacy and tenancy isolation |

## Decisions to resolve first for technical design

1. **O-002 + O-003 + O-004:** lease exclusivity, billing due dates, prorations.
2. **O-006:** fixed vs manually allocated electricity/service charges.
3. **O-007 + O-008 + O-009:** payment claim, verification, reversal and unapplied credit rules.
4. **O-014:** tenant onboarding and login for phone-centric users.
5. **O-010 + O-017:** receipt/invoice legal fields and tax treatment; obtain local professional advice before live use.

## Decision record template

```text
Decision ID:
Date:
Owner(s):
Context:
Options considered:
Decision:
Effect on v1.0 requirements:
Follow-up tasks:
```
