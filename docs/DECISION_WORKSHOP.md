# PlazaHub founder decision workshop

Task 003 • Prepared 2026-11-05 • Documentation only

**Historical workshop: PROPOSED — AWAITING FOUNDER APPROVAL when prepared.** Owner-delegated selections were subsequently recorded on 2026-11-05 as **SELECTED WORKING DEFAULT** in [DECISIONS](DECISIONS.md#current-selected-working-defaults), with the exact 12-gap mapping in [additional reconciliation](DECISIONS.md#additional-gap-reconciliation). Those selected portions supersede conflicting recommendations here; this is not both-founders sign-off or legal/privacy validation. Unselected options remain proposals. The original workshop is preserved in [history](history/pre-task004-2026-11-05/docs/DECISION_WORKSHOP.md).

## Current reconciliation notice

O-001–O-018 each have an owner-delegated selection, with residual details explicitly tracked. GAP-001–GAP-006 have partial selected rules; GAP-007–GAP-012 are unmapped/open. In particular O-014 now selects staff email/password plus MFA and tenant phone OTP (not the email-first tenant recommendation below); GAP-001 now authorizes narrow opening arrears/credit import scope; GAP-005 selects independent occupancy and availability (not this workshop's recommended disjoint headline precedence). The 30-day grace is selected under O-012, not a retention/deletion period. Per-lease invoice grouping, date-anchor/clamping rules, exact correction approval staffing and numerical legal/privacy windows were not selected. W2/W3/W7/W8 remain provisional where they depend on those details; the 75% occupancy example under GAP-005 is not the selected rate definition. W1's proposed account-finance grant is not automatically granted by the selected per-resource model.

Everything below records the original workshop discussion. Its “all awaiting approval” and “scope not added” statements are historical, not a reversal of current delegated selections. No old checklist box is marked signed by a founder.

## 1. Purpose, sources and process

Resolve policy ambiguity before implementing affected data models, authorization, leasing, billing and payments. Recommendations are engineering proposals for the Nigeria-first, NGN-only, manually reconciled plaza product described by the founders. They are not claims about universal Nigerian business practice, legal compliance, tax obligations or validated customer preferences.

Reviewed sources: [documentation authority](README.md), [PRD](PRD.md), [SRS](SRS.md), [original decisions](DECISIONS.md), [open questions](OPEN_QUESTIONS.md), [conceptual database](DATABASE_DESIGN.md), [permissions](ROLES_PERMISSIONS.md), [API outline](API_SPECIFICATION.md) and [AGENTS](../AGENTS.md). Existing documents are unchanged. The O identifiers retain their original meanings; GAP identifiers remain questions, not newly approved decisions. W examples and C conflict labels below are workshop references only, not replacement requirement or decision IDs.

For every O entry, the source is [DECISIONS: open decisions](DECISIONS.md#open-decisions-for-srs-workshop), with implementation gates in [OPEN_QUESTIONS: existing decisions](OPEN_QUESTIONS.md#existing-open-decisions). For every GAP entry, the source is [OPEN_QUESTIONS: additional gaps](OPEN_QUESTIONS.md#additional-gaps-not-new-approved-decisions). The matrix in section 7 maps every original ID to existing requirements.

Suggested attendees: both founders as decision owners; implementation engineer as recorder; the proposed pilot owner/manager/accountant for workflow evidence where available. Founders nominate the relevant professional reviewer for tax/legal fields. A workshop recommendation is not a vote or approval.

Suggested agenda, adjustable by founders:

1. 15 minutes: scope/invariants and conflicts; confirm what is explicitly outside v1.0.
2. 35 minutes: organization parties, user/tenant separation, representatives and authorization.
3. 35 minutes: lease boundaries, billing cadence, invoice grouping and service charges.
4. 50 minutes: claims, verification, allocations, corrections, opening balances and reporting dates.
5. 25 minutes: work through W1–W9 and confirm operational limitations.
6. 20 minutes: remaining module gates, individual decision records and next authorized task.

Unanswered items remain open. Split the meeting rather than blanket-approving unresolved details. Record the chosen option, exceptions, approvers and accepted examples for each ID. Subsequent specification updates and implementation require separate authorized work.

## 2. Priority and proposed MVP package

**Critical:** blocks data modeling, authorization, leasing, billing or payments. **Important:** must be settled before the relevant module/integration is implemented. **Later:** may remain open through initial scaffolding only under the stated containment; this is not a waiver of live-launch requirements.

| Category | IDs | Count |
|---|---|---:|
| Critical | O-001, O-002, O-003, O-004, O-005, O-006, O-007, O-008, O-009, O-010, O-014, O-015, O-016, O-017, O-018; GAP-001, GAP-002, GAP-003, GAP-004, GAP-005, GAP-006, GAP-008 | 22 |
| Important | O-012, O-013; GAP-007, GAP-009, GAP-011 | 5 |
| Later | O-011; GAP-010, GAP-012 | 3 |

All 30 items are individually listed in section 7. Priority here describes the earliest affected implementation gate; it does not replace the source BLOCKED/PROVISIONAL labels.

The proposed package is: one exclusive active lease per shop; monthly/quarterly/annual billing; fixed/manual service charges; separate claims and verified payments; partial payments with visible unapplied funds; explicit representative grants; auditable opening balances only if their migration scope is expressly authorized; initially one plaza per payment; separate transfer and verification dates; append-only adjustments/reversals; and receipts only for verified funds. Details and exceptions below are essential parts of the proposal, not optional assumptions.

Existing PRD invariants remain the baseline: no pending claim counts as cash, no silent financial overwrite, exact money, organization isolation, no routine platform-admin financial access, optional PWA installation and no default private financial caching. Alternatives requiring weaker invariants or new roadmap features are not automatically eligible MVP choices.

## 3. Critical decision cards

### O-001 — Contracting party versus data-owning organization

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** A managing organization may operate a plaza without being the named landlord. Assuming those are identical can put the wrong party on agreements and invoices.
- **Options:** A. Require the subscribing organization to be the contracting party. B. Keep organization as data owner and record the actual landlord/agent role on each lease. C. Support a full multi-party legal ownership/agency model, requiring a separate scope review.
- **Recommended default:** B, with a minimal explicit contracting-party snapshot and role on the agreement; preserve the organization isolation boundary. Founders validate actual pilot agreement/header fields.
- **Trade-offs:** A is simpler but excludes agency arrangements. B fits the stated owner/agent personas without sharing data across organizations, but requires accurate party entry. C adds substantial modeling and approval complexity.
- **Impact:** Organization, ShopTenant, Lease, LeaseTermVersion, Invoice snapshot; organizations/leasing/billing; TEN-001, LSE-001, BIL-001.
- **Acceptance examples:** Organization A manages for Landlord L: the lease/header names L in its recorded role while every record remains owned by A. Renaming A later leaves an issued invoice header unchanged. Organization B cannot read that lease by knowing L's name.

### O-002 — Exclusive leases and co-tenancy

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** Lease cardinality determines occupancy, conflict prevention and who owes each shop's charges.
- **Options:** A. One exclusive active lease per shop for any effective date. B. One lease with several liable co-tenants, requiring defined liability shares. C. Several concurrent leases per shop, requiring shared-occupancy rules and scope review.
- **Recommended default:** A. One business may rent several shops through separate leases; multiple representatives do not create co-tenancy. Confirm dated, finite lease terms for the pilot; do not invent open-ended overlaps.
- **Trade-offs:** A gives clear occupancy and billing ownership but excludes shared-shop contracts. B/C require additional liability and reporting policies; reject incompatible pilot records rather than pretending they fit A.
- **Impact:** Unit, ShopTenant, Lease, interval constraints; leasing/property; LSE-001, LSE-002, LSE-003, TEN-001.
- **Acceptance examples:** Two concurrent requests for Unit A-12 over the same date range yield one committed lease. The same business can lease A-12 and A-13 concurrently (W1). A future successor starting after the prior last occupied day succeeds (W2).

### O-003 — Cadence, first due date and date boundaries

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** Cadence alone does not define period start/end, month-end behavior, due dates or safe renewal turnover.
- **Options:** A. Calendar-aligned billing periods. B. Lease-anniversary monthly/quarterly/annual periods with an explicit due-date offset. C. Individually entered period/due dates for every bill.
- **Recommended default:** B. Store an explicit signed day offset from each period start (zero suggested, never inferred from an incomplete lease). UI lease end is the inclusive last occupied day; internal interval ends at the following date. First period starts on lease start. Derive each next boundary from the original anchor, clamping only that boundary to month-end, without cumulative drift. Due through the end of the chosen Africa/Lagos business day; overdue starts the next day. Preview before issue. Do not bill beyond a lease end: an incomplete last period requires O-004's reviewed amount.
- **Trade-offs:** B supports different lease anniversaries but needs clear date displays and clamping tests. A simplifies batch reporting but creates partial first periods. C is flexible but repetitive and harder to deduplicate.
- **Impact:** LeaseTermVersion, RecurringChargeRule, BillingObligation, InvoiceLine; leasing/billing/reporting; LSE-001, LSE-002, BIL-001, BIL-003, RPT-002.
- **Acceptance examples:** Monthly anchor January 31, 2027 gives boundaries Jan 31, Feb 28, Mar 31, Apr 30, not Mar 28. Quarterly January 1 gives April 1; annual January 1 gives next January 1. A bill due Jan 1 is not overdue that day; it is overdue on Jan 2 if unpaid. A missing due offset blocks issuance rather than silently choosing zero. W2/W3 exercise renewal and duplicates.

### O-004 — Proration and early termination

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** Mid-period changes can create disputed amounts or rewrite debt that has already been collected.
- **Options:** A. No automatic proration; explicit reviewed exact-amount adjustment. B. Actual-calendar-day proration. C. Fixed 30-day convention. B/C need additional rounding and boundary decisions.
- **Recommended default:** A. Staff records the agreed amount, effective date, rationale and source evidence; correction permissions follow O-015. “No automatic proration” must not silently charge a full period where the agreed period is partial.
- **Trade-offs:** A keeps the pilot rule set small but requires human review. B/C reduce manual work for uniform contracts but embed financial assumptions not yet validated.
- **Impact:** LeaseTermVersion, InvoiceAdjustment, AuditEvent; leasing/billing; LSE-002, BIL-001, BIL-003, BIL-004.
- **Acceptance examples:** A ₦100,000 invoice is not changed automatically when termination is recorded mid-period. An approved ₦40,000 credit adjustment leaves effective charge ₦60,000, with original invoice intact. If ₦75,000 was allocated, GAP-004 must release ₦15,000 before the adjusted balance can become zero.

### O-005 — Security deposits in the pilot

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** Treating a refundable deposit as rent or unapplied rent cash would misstate the proposed financial views.
- **Options:** A. Keep deposit custody/refund accounting outside v1.0 with an explicit external reconciliation handoff. B. Add a separate deposit liability register. C. Full deposit allocation/refund ledger. B/C require scope approval.
- **Recommended default:** A, only if the pilot owner accepts that operational limitation. Never import deposits as rent invoice debt, verified rent collections or ordinary unapplied rent funds. If deposits are indispensable, escalate scope rather than disguise them in an existing field.
- **Trade-offs:** A preserves the existing narrow MVP but is not a complete tenant-money ledger. B/C improve completeness while adding accounting and correction requirements.
- **Impact:** Import classification, billing/report exclusions, potential future deposit entity; imports/billing/reporting; IMP-001, BIL-001, RPT-001.
- **Acceptance examples:** A source file with ₦80,000 rent debt and ₦50,000 deposit held does not produce ₦130,000 rent debt. The unsupported deposit row is explicitly reported for external reconciliation, never silently discarded as successfully imported.

### O-006 — Service-charge allocation inputs

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** Generator, electricity and common-service charges need inspectable shop-level amounts without an unspecified apportionment engine.
- **Options:** A. Fixed recurring amounts plus manually entered per-shop charges. B. Manual amounts only. C. Automated area/usage/apportionment formulas, outside the working v1.0 decision unless scope changes.
- **Recommended default:** A, matching D-006. Capture category, lease/unit, period, amount and source note; staff owns the allocation calculation. Distinguish each approved charge occurrence/rule, even for repeated categories.
- **Trade-offs:** A handles recurring and variable charges but requires reconciliation of staff inputs. B is simpler but repetitive. C needs new metering/formula policies and is not a proposed MVP addition.
- **Impact:** ChargeType, RecurringChargeRule, BillingObligation, InvoiceLine; billing; BIL-001, BIL-002, AUD-001.
- **Acceptance examples:** A ₦60,000 manual generator batch allocated ₦20,000 to each of three shops reconciles to ₦60,000. A second run of the same recurring rule/period adds no charge. A separately documented occurrence must have its own identity; changing the HTTP key is not permission to double-charge the first occurrence.

### O-007 — Claim edits, cancellation and replacement

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** A tenant changing evidence while an accountant verifies it can produce an untraceable approval.
- **Options:** A. Immutable submission; cancel while pending or reject, then resubmit with a link to the original. B. Editable pending claims with retained versions and approval-version checks. C. Staff-only amendment with recorded tenant confirmation.
- **Recommended default:** A. Tenant can cancel own pending claim; staff may reject with a reason. Verified/rejected/cancelled claims cannot be rewritten. A replacement is a new assertion, not a new verified bank transfer.
- **Trade-offs:** A is easy to audit but adds resubmission steps. B/C are more convenient but complicate concurrent review and evidence lineage.
- **Impact:** PaymentClaim, ClaimReviewEvent, ClaimEvidence; payments/portal; PAY-001, PAY-002, PWA-002, AUD-001.
- **Acceptance examples:** A claim submitted as ₦75,000 cannot be PATCHed to ₦95,000. Cancel-versus-verify race allows one transition only. A rejected claim and its replacement remain visible as distinct review history, with no receipt for the rejected entry (W5).

### O-008 — Verification, reversal and separation of duties

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** Manual bank checking needs accountable approvers without allowing hidden self-confirmation.
- **Options:** A. A different authorized Owner/Accountant must approve than the person recording the claim/correction request. B. Allow an explicitly enabled, audited owner-only self-approval exception. C. Owner alone verifies every transfer.
- **Recommended default:** A for the pilot. The organization must provision at least two appropriate people where staff-originated claims/corrections need review; if unavailable, the claim stays pending. No automatic single-approver fallback. Manager/Tenant never verifies. Reversal requester and approver must also differ; both have the approved financial scope.
- **Trade-offs:** A provides stronger review but can delay small teams. B eases operation but weakens independent checking and needs a documented exception regime. C can bottleneck owners and does not by itself prevent self-review.
- **Impact:** Membership/RoleGrant, ClaimReviewEvent, VerifiedPayment, PaymentReversal, approval records; authorization/payments/audit; AUTH-002, PAY-002, PAY-004, AUD-001.
- **Acceptance examples:** Accountant U records a claim and is denied verification; independently authorized Owner V verifies once after checking bank records. A tenant-submitted claim may be checked by U. Simultaneous verify/reject creates at most one final review result and one payment. Self-requested reversal approval fails.

### O-009 — Partial payments, surplus and refunds

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** Verified money need not equal the sum of current invoices, and unused money must stay visible.
- **Options:** A. Manual allocations and a visible unapplied balance per debtor/plaza; no automated refunds. B. Automatically allocate oldest due debt first. C. Require exact settlements, which conflicts with BIL-004/PAY-003 and is not eligible without a PRD change.
- **Recommended default:** A. Permit partial payments and allocation to multiple eligible invoices in the same plaza/debtor scope. Staff explicitly selects allocations. Keep real refund handling unresolved/outside the initial implementation until its separate authorization and record requirements are agreed; a correction reversal is never used to pretend a refund happened. Pilot acceptance must confirm this limitation.
- **Trade-offs:** A preserves traceable intent but requires staff work. B reduces work but needs ordering/dispute rules. C violates required partial-payment/surplus behavior.
- **Impact:** VerifiedPayment, PaymentAllocation, AllocationReversal, derived unapplied balance; payments/billing/reporting; BIL-004, PAY-003, PAY-004, RPT-001.
- **Acceptance examples:** ₦200,000 debt minus ₦75,000 allocation leaves ₦125,000 (W4). ₦250,000 verified against ₦200,000 debt leaves zero debt and ₦50,000 unapplied, with verified collections still ₦250,000 (W6). A concurrent allocation cannot spend the same remainder twice.

### O-010 — Issued references and receipt meaning

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** Users need identifiable proof of verified funds and reproducible documents without mistaking receipts for new collections.
- **Options:** A. Per-organization, per-document-type serials; one receipt per verified payment. B. Serial scope per plaza with an organization-unique composite reference. C. A new receipt per allocation, requiring rules against apparent repeated receipt of the same funds.
- **Recommended default:** A, immutable issue snapshot and downloadable PDF. Suggested references `INV-000001`, `PAY-000001`, `RCT-000001`, unique within organization/type; no reuse, documented gaps permitted. Display issuer/contracting role, tenant, plaza, NGN amount, transfer date, verification timestamp, reference and current correction status. No signature or legal sufficiency is assumed; founder/professional review of required fields remains necessary under O-017. Allocation statements may evolve separately; later allocation does not issue a new funds receipt.
- **Trade-offs:** A gives a simple audit chain but needs an allocation statement beside the original receipt. B helps plaza-local administration but complicates sequence management. C risks confusing allocations with additional money.
- **Impact:** DocumentSequence, VerifiedPayment, Receipt, Invoice snapshots; billing/payments/files; BIL-003, PAY-003, PAY-004, PWA-002.
- **Acceptance examples:** Two concurrent verified payments get distinct organization receipt references. Retrying PDF rendering reuses the original reference. Pending/rejected claims cannot obtain a receipt. After a correction reversal, receipt lookup clearly shows its reversed status without deleting the original (W5/W8).

### O-014 — Tenant login and recovery

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** A phone-first portal still needs individually attributable identities and usable recovery; availability of tenant email has not been validated.
- **Options:** A. Verified email/password and invitation for pilot users. B. Phone OTP sign-in and recovery. C. Both email and phone with linked identity rules.
- **Recommended default:** A only after confirming intended pilot representatives have usable email. Otherwise return to B before implementation; do not invent email addresses or share a manager's credentials. Account recovery verifies the login identity and does not automatically grant shop access.
- **Trade-offs:** A avoids an extra phone delivery dependency but may exclude some intended users. B suits phone identifiers but adds delivery, abuse-control and number-reassignment policy. C raises identity-linking complexity. No claim about actual email/phone adoption is assumed.
- **Impact:** User, AuthSession, Invitation, recovery tokens, representative onboarding; identity/portal; AUTH-001, AUTH-004, PWA-001.
- **Acceptance examples:** Only the verified invitation recipient accepts the granted context; a reused recovery token fails. Knowing a business phone number grants no account access. A representative without the approved login channel receives an explicit onboarding exception, not shared credentials.

### O-015 — Invoice and expense approval boundaries

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** Requiring owner approval for every routine bill may obstruct operations, while unrestricted financial correction undermines auditability.
- **Options:** A. Scoped staff issue ordinary invoices/record expenses; Owner approval for issued-amount or recorded-expense corrections. B. Owner approves every invoice and expense. C. Monetary thresholds with escalation tiers.
- **Recommended default:** A. Manager/Accountant may prepare correction requests; a different Owner approves; a requester who is an Owner needs another authorized Owner for those corrections. Draft edits are scoped and auditable but do not require this correction approval. Payment reversals follow O-008 rather than being conflated with expense approval.
- **Trade-offs:** A preserves routine speed but requires a second Owner when the Owner requests corrections. B is easy to describe but slow. C needs configurable thresholds and new edge cases. Request permission is not execute/approve permission; the existing matrix would need an explicit split after approval.
- **Impact:** InvoiceAdjustment, ExpenseCorrection, approval records, scoped role actions; billing/expenses/authorization; BIL-003, EXP-001, AUTH-002, AUD-001.
- **Acceptance examples:** Manager issues a permitted ordinary invoice without owner review. Manager's request to reduce an issued ₦200,000 invoice has no effect until an independent Owner approves. A draft expense edit differs from a correction to a recorded expense. An Owner cannot approve their own correction request.

### O-016 — Tenant-visible terms and documents

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** Representatives need understandable debt and dates without automatically receiving confidential agreements or other shops' information.
- **Options:** A. Approved lease summary and explicitly permitted attachment classes. B. Full agreement and all linked documents for every tenant representative. C. Bills only with no lease summary, conflicting with PWA-001 unless changed.
- **Recommended default:** A. Show granted unit, tenant name, term dates, billing cadence, current rent summary, bills and authorized receipts. Full lease files remain private unless specifically classified and granted. Financial-resource visibility must satisfy GAP-006, not merely share the same business profile.
- **Trade-offs:** A adds projection/classification work but supports least privilege. B is simpler but exposes more than some representatives need. C removes required context.
- **Impact:** TenantResourceGrant, LeaseTermVersion projection, FileAsset classification; portal/leasing/files; PWA-001, PWA-002, OPS-002, TEN-001.
- **Acceptance examples:** A representative can see their granted lease expiry but cannot download a confidential lease scan by copying its URL. A file explicitly authorized to that representative downloads successfully with fresh checks. A partial-shop representative cannot read a full multi-shop receipt unless all its financial scope is authorized.

### O-017 — Tax and withholding treatment

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** Financial document fields and settlement treatment cannot be inferred from the NGN currency or country focus.
- **Options:** A. No automatic tax engine; only explicitly reviewed manual line/document treatment for the pilot. B. Automated tax/withholding calculations, requiring new scope and specialist-approved rules. C. Restrict the pilot to workflows whose approved documents and settlement can be represented without automated tax handling.
- **Recommended default:** A with a C eligibility gate: founders obtain review of actual pilot invoice/receipt requirements before live issuance. Do not assume a tax rate, exemption, or that withholding is cash. If essential settlement cannot be represented faithfully, stop that workflow for a decision rather than inventing a credit allocation.
- **Trade-offs:** A limits software scope but still requires verified input/field rules. B adds legal/accounting dependencies and change management. C may narrow eligible pilot cases without silently changing the product requirement.
- **Impact:** InvoiceLine, issuer/receipt snapshots, adjustment types and settlement reporting; billing/payments; BIL-001, BIL-002, BIL-003, PAY-003.
- **Acceptance examples:** An unconfigured tax amount is never added automatically. If an approved invoice is ₦100,000 and only ₦90,000 is verified in the bank, collections are ₦90,000; the remaining ₦10,000 is not cleared merely because a user types “withheld.” Any approved noncash treatment needs a separate attributable rule/example before implementation.

### O-018 — Shared identity across organizations

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** One person can rent from several organizations; convenience must not create shared tenant records or combined privileges.
- **Options:** A. One login identity with separate organization memberships and explicit representative grants. B. Separate login accounts per organization. C. Shared cross-organization business profiles, requiring a different privacy/product design.
- **Recommended default:** A. Each organization owns its ShopTenant and leases independently; identity reuse grants no access. Roles remain bound to each organization/plaza grant. No platform-wide customer lookup visible to organization staff.
- **Trade-offs:** A reduces repeated login friction but requires rigorous context separation. B simplifies some boundaries at the cost of account fragmentation. C is not a proposed v1.0 extension.
- **Impact:** User, OrganizationMembership, RoleGrant, ShopTenant, TenantRepresentative; identity/organizations/leasing; AUTH-002, AUTH-003, TEN-001.
- **Acceptance examples:** User U is Owner in A and Tenant in B; Owner authority does not carry into B. Revoking A membership leaves B membership unaffected. A profile edit in A does not update B's business record (W9).

### GAP-001 — Auditable opening balances and migration scope

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** Registry-only onboarding does not explain pre-existing debt/credit, but replaying all historical transactions risks false new collections and duplicates.
- **Options:** A. Start at zero and keep legacy balances outside the app. B. Reconciled opening entries by tenant/plaza/lease and original due bucket, with source provenance and sign-off. C. Full historic invoice/payment reconstruction with reconciliation.
- **Recommended default:** B as a conditional migration proposal, not an approved addition to IMP-001. Founders must expressly decide whether this is an authorized MVP onboarding refinement; until then financial opening import stays blocked. Separate opening debt from supported opening credit; do not net away evidence or create synthetic current verified payments. Deposits remain excluded under proposed O-005. Preserve legacy receipt references as provenance, not newly issued receipts. Unknown due dates require explicit exception handling, not invented dates.
- **Trade-offs:** A is simplest but incomplete for existing arrears. B provides explainable starting balances with less history, but needs new opening-entry semantics and a signed reconciliation. C is expensive and sensitive to poor source data.
- **Impact:** Proposed OpeningBalanceEntry/MigrationBatch (names only, not added schema), provenance, future obligation/payment allocation eligibility; imports/billing/payments/reporting; IMP-001, BIL-004, RPT-001, RPT-002, AUD-001.
- **Acceptance examples:** A signed ₦120,000 opening debt increases outstanding by ₦120,000 but creates no current-period rent charge, verified collection or receipt (W7). Re-importing its source key adds nothing. A separate opening credit is not included in current-period collections and cannot become spendable without its separately approved credit provenance policy.

### GAP-002 — Transfer dates, verification dates and report cutoffs

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** A transfer may be verified days later; different date bases can produce conflicting monthly totals and silently restated arrears.
- **Options:** A. Collections recognized at verification; retain transfer date for reconciliation. B. Recognize by transfer date once verified, explicitly restating earlier periods. C. A separately controlled accounting-effective date.
- **Recommended default:** A for operational collections. Preserve both dates; timestamp events in UTC and interpret business dates in Africa/Lagos. Reversals/adjustments affect operational totals when authorized and posted, preserving earlier as-of views; show correction links. Expense-period totals use recorded expense business date with report generation cutoff disclosed; do not label them cash-paid totals. Proposed ageing buckets: not yet overdue, 1–30, 31–60, 61–90, over 90 days after due date. No hidden backdated recognition.
- **Trade-offs:** A is reproducible but differs from bank-month totals when review is delayed; show transfer-date reconciliation alongside it. B aligns transfer periods but needs explicit restatement semantics. C increases accounting controls beyond a simple operational ledger.
- **Impact:** PaymentClaim transfer date, VerifiedPayment verification instant, correction posting time, report snapshot/cutoff; payments/reporting/expenses; PAY-002, RPT-001, RPT-002, EXP-001.
- **Acceptance examples:** Transfer Jan 31, verified Feb 2: January verification-basis collections exclude it; February includes it. A March 3 reversal appears in March corrections without silently rewriting February as-of output. Jan 1 due date is one day overdue Jan 2. Screen/export using identical as-of filters reconcile.

### GAP-003 — Payment plaza scope

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** Organization-wide funds can expose other plazas and make local collection/unapplied totals ambiguous.
- **Options:** A. One plaza and debtor per claim/verified payment, with allocations to that debtor's eligible invoices within the plaza. B. Organization-wide payment with explicit multi-plaza allocation and credit attribution. C. One bank-transfer parent split into reconciled plaza sub-payments.
- **Recommended default:** A initially. Ask the pilot to use plaza-specific transfer references/settlement. An actual transfer intended for multiple plazas must remain an explicit unresolved reconciliation case; do not record its full amount once per plaza or silently split it. If such transfers are normal for the pilot, resolve B/C before accepting that workflow.
- **Trade-offs:** A simplifies permissions and report totals but limits shared transfers. B/C better reflect combined remittances but require additional ownership, evidence and uniqueness controls.
- **Impact:** PaymentClaim, VerifiedPayment, PaymentAllocation, unapplied scope and authorized receipt projection; payments/authorization/reporting; AUTH-002, PAY-001, PAY-003, RPT-001, PWA-002.
- **Acceptance examples:** A ₦100,000 Plaza A payment cannot allocate to Plaza B's invoice even for the same business. It appears once in organization collections and in A only. Another claim with the same reference/date/amount in B triggers review; the same bank event cannot be approved a second time. Claims remain assertions until the external reconciliation is resolved.

### GAP-004 — Correction after allocation and reversal semantics

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** Reducing a partly paid invoice or reversing its funds can break balances if amounts are edited independently.
- **Options:** A. Append invoice adjustments, release any excess allocation atomically, and use linked payment reversal records for invalid funds. B. Reverse allocations, void and replace the whole invoice every time. C. Prohibit correction after payment, which cannot satisfy the PRD correction/reversal journey without exception.
- **Recommended default:** A. Never directly void an allocated invoice. A correction reducing charge below allocated funds releases the excess into unapplied funds in the same transaction. Full payment reversals atomically reverse all affected allocations; for a wrongly recorded amount, full reversal plus linked corrected verification is proposed for MVP rather than partial payment reversal. Original and replacement evidence must remain linked so the corrected record cannot double-count a bank event. Genuine refunds remain distinct and unresolved under O-009.
- **Trade-offs:** A preserves a clear invoice chain but requires robust transaction/approval rules. B is uniform but creates more replacement paperwork. C avoids work by removing required capability and is not the recommended option.
- **Impact:** InvoiceAdjustment, AllocationReversal, PaymentReversal, Receipt, AuditEvent; billing/payments/reporting; BIL-003, BIL-004, PAY-004, AUD-001.
- **Acceptance examples:** ₦200,000 invoice with ₦150,000 allocated is corrected to ₦120,000: append −₦80,000 adjustment and release ₦30,000 allocation atomically. Debt becomes zero, payment remains ₦150,000, unapplied becomes ₦30,000; no refund/second receipt occurs (W8). Concurrent allocation sees either pre- or post-correction state, never negative debt. Reversal retry cannot deduct twice.

### GAP-005 — Occupancy and out-of-service precedence

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** An active lease and out-of-service label can otherwise count one unit twice or hide a real occupant.
- **Options:** A. Disjoint headline counts with occupied precedence; separate maintenance/out-of-service flag on occupied units. B. Two independent dimensions with overlapping totals explicitly labeled. C. Out-of-service overrides occupied, conflicting with the PRD's “cannot conceal active lease” rule.
- **Recommended default:** A. Among non-retired units: occupied if an applicable lease exists; otherwise out of service if flagged; otherwise vacant. Show an additional “occupied with out-of-service flag” exception list. Occupancy rate = occupied / (occupied + vacant), excluding unoccupied out-of-service units. Block new lease activation while an out-of-service flag is unresolved; preserve existing active leases.
- **Trade-offs:** A produces additive totals but needs an exception flag to show operational problems. B is richer but easier to misread. C is incompatible with the stated occupancy invariant.
- **Impact:** Unit operational state, Lease interval, report projection; property/leasing/reporting; PLZ-002, LSE-001, LSE-003, RPT-001.
- **Acceptance examples:** Ten units: six leased (one flagged), two vacant and two unleased out of service → headline 6/2/2, occupied-flag exception 1, occupancy 75%. An empty eligible denominator displays not applicable, not divide-by-zero. Retirement cannot hide an active lease; resolve the lease first.

### GAP-006 — Representatives and explicit resource grants

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** A business may have a proprietor and shop staff with different access, including after a lease ends.
- **Options:** A. One representative with all business access. B. Multiple representatives with explicit selected-lease grants and a separately explicit account-finance grant. C. Multiple representatives automatically receive all current/future leases.
- **Recommended default:** B. Scoped Owner/Manager invites/removes representatives only within their authority. Grants list lease resources; future/renewed leases require explicit grant review. Account-finance permission is scoped by organization, business and plaza and separately authorizes account-wide payments/unapplied funds. A lease-only representative sees that lease's invoices/allocations; full multi-lease receipt/evidence requires permission over its complete financial scope. Lease expiry alone retains historical granted documents until explicit revocation; it never grants the incoming lease. Review historical access with O-012/O-013 before launch.
- **Trade-offs:** B is precise but adds grant administration. A is simpler but encourages shared credentials or prevents delegation. C is convenient but can expose unrelated shops or renewed agreements.
- **Impact:** User, Membership, TenantRepresentative, TenantResourceGrant, payment/receipt projections; identity/authorization/leasing/portal; AUTH-002, AUTH-003, TEN-001, PWA-001, PWA-002, OPS-002.
- **Acceptance examples:** Proprietor has explicit A-12/A-13 and account-finance grants; clerk has A-12 only. Clerk sees A-12 debt but cannot download the full receipt spanning A-12/A-13. Revoking clerk access blocks its next API/file request while preserving audit history. Neither invitation nor renewal adds unrelated lease access (W1/W9).

### GAP-008 — Invoice grouping and due dates

**Status: PROPOSED — AWAITING FOUNDER APPROVAL.**

- **Business problem:** Consolidating leases or different due dates changes invoice ownership, balances and tenant visibility.
- **Options:** A. One lease/plaza per invoice with a single common due date. B. One business/plaza invoice spanning leases and independently dated lines. C. Organization-wide multi-plaza consolidated invoices.
- **Recommended default:** A. Multiple charge lines may share one invoice only when lease and due date match; otherwise issue separate invoices. One business may still view an authorized aggregate account summary. A payment can settle several eligible invoices under GAP-003. Corrections retain original obligation identity so regrouping cannot duplicate debt.
- **Trade-offs:** A gives simple resource authorization and overdue state but more invoices. B/C reduce document counts while complicating partial settlement, visibility and due-date status.
- **Impact:** Invoice, InvoiceLine, BillingObligation, PaymentAllocation; billing/payments/portal; BIL-001, BIL-002, BIL-003, PAY-003, PWA-001.
- **Acceptance examples:** A-12 rent due Jan 1 and security charge due Jan 15 yield separate invoices. A-12 and A-13 never share an invoice. An authorized ₦100,000 payment can allocate ₦60,000 to one and ₦40,000 to the other within the same plaza/debtor without merging their dates.

## 4. Important and later decisions

Every row in this section has status **PROPOSED — AWAITING FOUNDER APPROVAL**. Deferral contains the feature; it does not approve a default or waive a source requirement.

| ID / priority | Business choice and recommended proposal | Trade-off / question to record | Gate and acceptance evidence |
|---|---|---|---|
| O-012 / Important | Choose immediate suspension versus a named read/export grace period. Recommend manual lifecycle management with a founder-specified grace period and preserved authenticated historical read/export; editing restrictions must be explicit for both staff and tenants. No automated subscription system. | Duration, who suspends, how reinstatement works and whether claim submission is disabled must be answered. No duration is silently chosen here. | Before lifecycle authorization implementation/live onboarding. Demonstrate suspended users cannot mutate through direct APIs; permitted downloads still enforce scope; restored access does not alter audit history. |
| O-013 / Important | Choose a documented retention/deletion schedule by data class versus indefinite retention. Recommend a reviewed schedule covering live DB, evidence, exports, backups and cancellation, including holds and export requests. | Financial history, personal data and backups have different needs; do not invent legal retention periods. Founders name reviewer and approve exact periods/process before production. | Before retention/deletion module and production storage policy. Demonstrate approved expiry/export/deletion behavior and explain backup expiry/recovery implications. Destructive operations still require human approval. |
| GAP-007 / Important | Choose named pilot support/reconciliation/incident owners and measurable service targets versus informal availability. Recommend named owners and an agreed dataset/recovery exercise. | Founders provide expected organizations/plazas/units, users, file volumes, recovery-point/recovery-time objectives, backup cadence and support contact. The PRD p95 target is not a measured SLA. | Before operations implementation/sizing and pilot launch. Restore DB plus private files, reconcile totals and test alert delivery against approved targets. |
| GAP-009 / Important | Choose atomic validated imports versus partial-row commit; overwrite/merge versus reject duplicates. Recommend atomic commit of a fully validated batch, stable source keys, no silent merge; explicit rerun returns prior result. Invites single-use/revocable with rechecked inviter authority; approve concrete expiry/upload/CSV limits before implementation. | Atomic commit requires fixing all invalid rows but avoids partially migrated financial/lease state. Engineering proposes numerical limits based on representative inputs; founders confirm workflow impact. | Before import commit, invite delivery or upload implementation. Invalid row → zero writes; retry → no duplicates; revoked invite rejected; oversized/disallowed file fails; export is spreadsheet-safe. |
| GAP-011 / Important | Choose managed providers versus self-managed operations. Recommend documenting auth/storage/email/jobs/hosting selection against budget, residency and approved recovery goals before commitment; no vendor selected here. | Obtain actual provider capabilities/costs during a separately authorized evaluation. Do not infer residency or recovery guarantees from a brand name. | Before provider integration/provisioning. Demonstrate revoke/session behavior, private downloads, delivery retries and restore path using synthetic data. |
| O-011 / Later | Choose org subscription priced by plaza/size versus another commercial basis. Recommend organization as payer with manual pilot commercial arrangements; exact price remains founder-owned. | Can wait through scaffold; needs commercial agreement before a paid pilot. Does not authorize checkout, subscriptions, dunning or new pricing UI. | No billing automation/schema required now. Manual onboarding terms must clearly identify the payer before charging customers. |
| GAP-010 / Later | Choose no support-data access path versus customer-authorized, expiring access. Recommend no exceptional financial access capability initially; use customer-provided redacted evidence for support. | Can wait only while the bypass/impersonation feature remains absent. If needed later, settle customer approver, permitted actions/resources, expiry, revocation and event review before building it. | Routine Platform Admin denial remains mandatory now. Test that provisioning admin cannot read invoices/files/reports. Revisit GAP-010 before any exceptional-access implementation. |
| GAP-012 / Later | Choose to defer optional contact requests versus implement a tenant request/staff-approval flow. Recommend defer PWA-005 while P0 journeys are completed; staff-authorized contact maintenance remains scoped. | PWA-005 stays P1, not deleted or silently promoted. If included later, confirm reviewer role, conflict handling and separation from login credential changes. | No contact-request implementation until separately prioritized. When included, submission cannot directly alter authoritative contact/login data. |

## 5. Worked acceptance examples

All people, businesses, plazas, amounts and dates below are synthetic. These are candidate expected outcomes under the recommended options, not executed tests or approved policy. When a founder selects another option, revise the affected example before treating it as an implementation oracle. Amounts are exact NGN; store equivalent integer kobo or another approved exact representation, never floating-point currency arithmetic.

### W1 — One business rents multiple shops

**Decisions:** O-001, O-002, O-016, O-018, GAP-003, GAP-006, GAP-008. **Requirements:** TEN-001, LSE-001, AUTH-002, PWA-001, PWA-002.

Given Organization A, Plaza Alpha and ShopTenant “Unity Stores,” create Lease L12 for A-12 and Lease L13 for A-13. Their independently issued invoices are ₦600,000 and ₦400,000. There is one business profile, two leases and two invoices; no duplicate business identity is needed just to rent the second shop.

Proprietor P has explicit L12/L13 and Alpha account-finance grants. Clerk C has L12 only. P sees ₦1,000,000 total outstanding; C sees only ₦600,000 and cannot query L13 or the business-wide unapplied balance. A verified ₦250,000 payment allocated ₦150,000 to L12 and ₦100,000 to L13 reduces their debt to ₦450,000 and ₦300,000. P may download the full payment receipt; C may see its permitted L12 allocation but not a full receipt exposing L13. A future Lease L14 does not silently expand either grant.

### W2 — Renewal and date boundaries

**Decisions:** O-002, O-003, O-004, GAP-005, GAP-006. **Requirements:** LSE-001, LSE-002, LSE-003, BIL-001.

Old agreement L1 occupies A-12 from January 1 through December 31, 2027 inclusive: internal interval `[2027-01-01, 2028-01-01)`. A newly executed renewal agreement L2 links to L1 and begins January 1, 2028. At the boundary only L2 applies; L1 remains historical. The proposed choice is a new linked Lease for a newly executed renewal, with LeaseTermVersion reserved for effective changes within that agreement; founders must explicitly accept this representation with O-001/O-003.

A new lease starting December 31, 2027 overlaps L1 and fails. Two concurrent overlapping new leases cannot both commit. L1's ₦600,000 historical invoice stays ₦600,000 when L2's rent becomes ₦660,000. Grant review is explicit for L2. Mid-period termination does not silently prorate or change an issued amount; an incomplete terminal billing period requires a reviewed amount under O-004.

### W3 — Invoice generation and duplicate prevention

**Decisions:** O-003, O-006, O-010, O-015, GAP-008. **Requirements:** BIL-001, BIL-002, BIL-003, AUD-001.

Given a lease with annual rent ₦600,000, period `[2027-01-01, 2028-01-01)`, due offset zero, preview displays due January 1, 2027 and no operational debt is issued yet. Issuing creates one obligation/invoice, with exact stored amount 60,000,000 kobo and a stable reference.

Repeating the request with the same idempotency key returns that result. A simultaneous request with another HTTP key for the same business obligation also cannot create a second charge. Proposed rent obligation identity includes organization, lease, rent occurrence and period; a new term-version ID alone must not evade duplicate protection. If a reviewed source term changes before issuance, stale preview fails rather than silently billing the new amount. A new legitimate service occurrence may be billed separately with its own documented source identity. Issued rent changes use the correction workflow, not a regenerated duplicate obligation.

### W4 — Partial payment

**Decisions:** O-008, O-009, O-010, GAP-002, GAP-003. **Requirements:** BIL-004, PAY-001, PAY-002, PAY-003, RPT-001.

| Step | Invoice debt | Verified collections | Effective allocations | Unapplied funds |
|---|---:|---:|---:|---:|
| Issue invoice | ₦200,000 | ₦0 | ₦0 | ₦0 |
| Submit ₦75,000 claim | ₦200,000 | ₦0 | ₦0 | ₦0 |
| Independently verify ₦75,000 | ₦200,000 | ₦75,000 | ₦0 | ₦75,000 |
| Allocate ₦75,000 to invoice | ₦125,000 | ₦75,000 | ₦75,000 | ₦0 |

Receipt records ₦75,000 verified funds, not ₦200,000 invoice value. Allocation does not add collections again. A second concurrent attempt to allocate that spent ₦75,000 fails or safely returns the original operation. Outstanding becomes overdue only after the approved due-day boundary.

### W5 — Pending and rejected transfer claims

**Decisions:** O-007, O-008, O-010. **Requirements:** PAY-001, PAY-002, PWA-002, AUD-001.

Given ₦200,000 outstanding, a tenant submits a ₦75,000 claim with image evidence. Debt remains ₦200,000; verified collections are zero; no receipt is downloadable. Accountant rejects it with an attributable reason after the bank check fails. These amounts remain unchanged; tenant sees Rejected, not Paid.

A replacement claim links to the rejected claim and starts Pending. Verifying the replacement can create one VerifiedPayment only. Cancel/verify races on a pending claim have one winner; verification cannot proceed against a cancelled submission. Similar references generate a review warning rather than proof of a second bank receipt.

### W6 — Overpayment and later use of unapplied funds

**Decisions:** O-009, O-010, GAP-003. **Requirements:** BIL-004, PAY-003, RPT-001.

Verify ₦250,000 against a ₦200,000 invoice for Unity Stores in Alpha. Allocate ₦200,000: debt zero, verified collections ₦250,000, unapplied funds ₦50,000. Issue one ₦250,000 receipt; show the current allocation statement separately. Never clamp away the ₦50,000 or report a negative invoice debt.

Later issue another eligible Alpha invoice for ₦80,000. Explicitly allocate the existing ₦50,000: new invoice debt ₦30,000, unapplied funds zero. Collections do not rise, and no additional funds receipt is issued. Allocation to another plaza or another business fails. A refund request remains a distinct operational exception until a genuine refund workflow is approved; reversing a valid payment is not an acceptable substitute.

### W7 — Opening debt import (conditional scope)

**Decisions:** O-005, O-009, GAP-001, GAP-002, GAP-009. **Requirements:** IMP-001, BIL-004, RPT-001, RPT-002, AUD-001.

This example cannot be implemented merely by approving ordinary unit/tenant/lease CSV import. It requires a specific founder scope disposition for GAP-001 and follow-up specification updates.

At approved cutover January 1, 2027, signed source batch M1 identifies ₦120,000 unpaid legacy rent for L12, original due date December 1, 2026, stable source row `legacy-L12-2026-12`. Preview validates owner/plaza/lease, exact amount, source reference and duplicates. Owner signs off totals before atomic commit; missing due date or conflicting source totals prevents ordinary commit and requires explicit resolution.

The proposed opening entry increases debt by ₦120,000, separately labeled opening debt. Current-period new billings and collections remain zero; no payment receipt is generated. On January 1 it is 31 days overdue under the proposed GAP-002 convention. Replaying M1 cannot add a second ₦120,000. After a subsequent real ₦50,000 payment is verified and allocated to that eligible opening obligation, debt becomes ₦70,000 and new collections ₦50,000. Historical receipts do not become current collections. Deposits are not included, and opening credits must stay separate with approved provenance and allocation rules.

### W8 — Invoice correction after payment allocation

**Decisions:** O-004, O-008, O-009, O-015, GAP-002, GAP-004. **Requirements:** BIL-003, BIL-004, PAY-004, AUD-001, RPT-001.

Initial invoice I1: ₦200,000. Verified payment P1: ₦150,000, fully allocated to I1. Outstanding: ₦50,000. The organization establishes that the correct invoice amount was ₦120,000.

An authorized person requests a −₦80,000 adjustment with evidence. Request alone changes no balance. Independent authorized approval commits the adjustment and a ₦30,000 allocation reversal atomically. Original face amount remains ₦200,000; adjustment is −₦80,000; effective charge is ₦120,000; effective allocation is ₦120,000; debt is zero. P1 remains valid ₦150,000, with ₦30,000 unapplied. Its original verified-funds receipt remains valid; the current allocation/correction statement explains the change. No bank refund or new collection has occurred.

If P1 itself was falsely verified instead, use an approved full payment reversal: reverse its effective allocations and funds effect in one transaction, retain the original receipt with a clear reversed status, and reopen the applicable debt. A later corrected payment requires linked review/evidence, not a duplicate unlinked bank event. Repeating either corrective operation cannot apply it twice. If the audit write fails, all financial effects roll back.

### W9 — Unauthorized cross-organization and cross-resource access

**Decisions:** O-018, O-016, GAP-006; containment for GAP-010. **Requirements:** AUTH-001, AUTH-002, AUTH-003, AUTH-004, OPS-002, AUD-001.

User U is Owner in Organization A and Tenant in Organization B with only Lease B1 granted. U cannot use the Owner role from A to read B2, B's expenses or audit history. Requests with Organization A context and B's invoice/file/export ID return no protected data or existence details; writes with mixed-organization references fail. The same checks apply to search counts, reports and background exports, not only detail pages.

An unrelated Tenant in A cannot retrieve Unity Stores' receipt by guessing its ID. A Platform Admin provisioning account cannot retrieve any customer financial attachment by virtue of its platform role. Revoking U's B grant blocks subsequent downloads/export execution while leaving A authority independently valid. Switching context clears prior private browser views; no private financial response is cached by default. Audit history remains attributable after revocation.

## 6. Conflicts and decisions that cannot be silently bundled

| Ref | Source tension / newly exposed interaction | Required founder disposition |
|---|---|---|
| C1 | PRD LSE-001 describes exclusive leases while O-002 still asks whether co-tenancy is needed. Monthly/quarterly/annual cadence exists, but its detailed schedule O-003 is open. | Confirm the narrower exclusive model and exact date examples. Choosing shared leases requires explicit requirement/design revision, not treating the alternative as already approved. |
| C2 | D-006/BIL-002 establish fixed/manual charges; O-006 asks for exact allocation inputs/approvers. | Approve those details without reopening metering/formula automation as an implicit MVP feature. |
| C3 | IMP-001 explicitly names unit/tenant/lease CSV imports; GAP-001 proposes financial opening entries. | Record explicit scope disposition. This workshop does not add an opening-balance feature to the approved PRD. If deferred, acknowledge that the pilot cannot claim complete in-app legacy arrears reconciliation. |
| C4 | PAY-003 allows several invoices per payment; proposed one-plaza payments and one-lease invoices constrain eligible combinations. | Confirm same-plaza/multiple-lease allocations and real combined-transfer handling. Do not silently split or double-record a cross-plaza bank event. |
| C5 | A verified Payment is unique per claim, but several claims can describe the same bank event. Reference/amount warnings alone do not prove event uniqueness. | Approve the bank-review evidence and duplicate-resolution procedure under O-008/GAP-003, including linked replacement after correction. Retry idempotency and business duplicate review are separate controls. |
| C6 | O-008 merely discourages self-review where possible; the proposed default prohibits it. O-015's proposed owner correction rule may require a second Owner. | Explicitly accept staffing constraints or choose a documented exception model; do not claim the stricter proposal is the current approved policy. |
| C7 | The role matrix has Manager correction permissions denied/pending; proposed O-015 allows Manager to request, not approve, correction. | If approved, split request/approve/execute actions in the matrix. Do not grant execution just because a request screen exists. |
| C8 | One receipt per payment can reveal several leases to a representative granted only one lease. Unapplied funds are account-level. | Approve the scoped projections and separate account-finance grant under GAP-006/O-016; lease access alone does not imply whole-account evidence access. |
| C9 | “Cash collected” may be read as transfer-date cash, while recommended GAP-002 uses verification-date operational collections. PRD demo calls outstanding “arrears” without specifying due dates. | Approve explicit metric labels/date basis and bank reconciliation view. Do not classify all outstanding as overdue or present verification-date totals as identical to bank-period totals. |
| C10 | Out-of-service and active-lease status can overlap; the PRD asks for separate counts without a precedence/denominator rule. | Approve GAP-005 counts and exception display; a manual label cannot conceal occupancy. |
| C11 | Credit, reversal, refund, withholding and deposit are different events. Reusing a single negative-payment/adjustment path could misstate cash. | Confirm O-005/O-009/O-017/GAP-004 boundaries and pilot exclusions. A real refund or withholding settlement remains blocked until an honest representation is approved. |
| C12 | Root AGENTS describes Task 002 as documentation-only and requiring later implementation authorization. Task 003 is also documentation-only. | The present task authorizes this workshop only. Safe-to-start foundation work below still needs a subsequent explicit task; no scaffold/migration is authorized by the workshop. |

## 7. Decision-to-requirement traceability and approval checklist

Every box below is intentionally unchecked. Each row keeps its original ID and source link. All statuses are **PROPOSED — AWAITING FOUNDER APPROVAL**. Module impact for critical items is detailed in section 3. Referenced requirement IDs are existing PRD/SRS IDs; the matrix does not create new functional requirements for gaps without coverage.

| Founder review | Original reference / title | Priority | Existing requirement trace | Workshop evidence / gate |
|---|---|---|---|---|
| [ ] | [O-001](DECISIONS.md#open-decisions-for-srs-workshop) Contracting party | Critical | TEN-001, LSE-001, BIL-001 | Card O-001; W1; party snapshots |
| [ ] | [O-002](DECISIONS.md#open-decisions-for-srs-workshop) Exclusive leases | Critical | TEN-001, LSE-001, LSE-002, LSE-003 | W1/W2; C1 |
| [ ] | [O-003](DECISIONS.md#open-decisions-for-srs-workshop) Cadence and due dates | Critical | LSE-001, LSE-002, BIL-001, BIL-003, RPT-002 | W2/W3; month-end examples |
| [ ] | [O-004](DECISIONS.md#open-decisions-for-srs-workshop) Proration | Critical | LSE-002, BIL-001, BIL-003, BIL-004 | W2/W8; reviewed amount |
| [ ] | [O-005](DECISIONS.md#open-decisions-for-srs-workshop) Deposits | Critical | BIL-001, RPT-001, IMP-001 | W7; external reconciliation limitation |
| [ ] | [O-006](DECISIONS.md#open-decisions-for-srs-workshop) Service charges | Critical | BIL-001, BIL-002, AUD-001 | W3; manual batch reconciliation |
| [ ] | [O-007](DECISIONS.md#open-decisions-for-srs-workshop) Claim edit/cancel | Critical | PAY-001, PAY-002, PWA-002, AUD-001 | W5; cancel/verify race |
| [ ] | [O-008](DECISIONS.md#open-decisions-for-srs-workshop) Verification/reversal authority | Critical | AUTH-002, PAY-002, PAY-004, AUD-001 | W4/W5/W8; C5/C6 |
| [ ] | [O-009](DECISIONS.md#open-decisions-for-srs-workshop) Unapplied funds/refunds | Critical | BIL-004, PAY-003, PAY-004, RPT-001 | W4/W6/W8; real refund gate |
| [ ] | [O-010](DECISIONS.md#open-decisions-for-srs-workshop) Receipt/reference rules | Critical | BIL-003, PAY-003, PAY-004, PWA-002 | W3/W5/W6; PDF retry |
| [ ] | [O-011](DECISIONS.md#open-decisions-for-srs-workshop) SaaS payer/pricing | Later | PLZ-001 context; no v1.0 automated subscription requirement | Manual commercial agreement; no new billing scope |
| [ ] | [O-012](DECISIONS.md#open-decisions-for-srs-workshop) Expiry access | Important | AUTH-002, RPT-002, PWA-001 | Before lifecycle authorization; duration unanswered |
| [ ] | [O-013](DECISIONS.md#open-decisions-for-srs-workshop) Retention/cancellation | Important | OPS-001, OPS-002, IMP-001, AUD-001 | Before retention policy/module and live data |
| [ ] | [O-014](DECISIONS.md#open-decisions-for-srs-workshop) Tenant authentication | Critical | AUTH-001, AUTH-004, PWA-001 | Pilot channel eligibility; token replay |
| [ ] | [O-015](DECISIONS.md#open-decisions-for-srs-workshop) Invoice/expense approvals | Critical | AUTH-002, BIL-003, EXP-001, AUD-001 | W8; C6/C7 |
| [ ] | [O-016](DECISIONS.md#open-decisions-for-srs-workshop) Tenant-visible fields/files | Critical | TEN-001, PWA-001, PWA-002, OPS-002 | W1/W9; C8 |
| [ ] | [O-017](DECISIONS.md#open-decisions-for-srs-workshop) Tax/withholding | Critical | BIL-001, BIL-002, BIL-003, PAY-003 | Reviewed pilot fields; no invented tax rates |
| [ ] | [O-018](DECISIONS.md#open-decisions-for-srs-workshop) Cross-org identities | Critical | AUTH-002, AUTH-003, TEN-001 | W9; isolated memberships |
| [ ] | [GAP-001](OPEN_QUESTIONS.md#additional-gaps-not-new-approved-decisions) Opening balances | Critical | IMP-001, BIL-004, RPT-001, RPT-002, AUD-001 (proposed elaboration, not scope approval) | W7; C3; explicit scope disposition |
| [ ] | [GAP-002](OPEN_QUESTIONS.md#additional-gaps-not-new-approved-decisions) Recognition/cutoffs | Critical | PAY-002, EXP-001, RPT-001, RPT-002 | W4/W7/W8; Jan/Feb boundary |
| [ ] | [GAP-003](OPEN_QUESTIONS.md#additional-gaps-not-new-approved-decisions) Payment plaza scope | Critical | AUTH-002, PAY-001, PAY-003, RPT-001, PWA-002 | W1/W6; C4/C5 |
| [ ] | [GAP-004](OPEN_QUESTIONS.md#additional-gaps-not-new-approved-decisions) Allocated invoice correction | Critical | BIL-003, BIL-004, PAY-004, AUD-001 | W8; transaction rollback |
| [ ] | [GAP-005](OPEN_QUESTIONS.md#additional-gaps-not-new-approved-decisions) Occupancy conflicts | Critical | PLZ-002, LSE-001, LSE-003, RPT-001 | 10-unit count example; C10 |
| [ ] | [GAP-006](OPEN_QUESTIONS.md#additional-gaps-not-new-approved-decisions) Representative grants | Critical | AUTH-002, AUTH-003, TEN-001, PWA-001, PWA-002, OPS-002 | W1/W2/W9; full receipt scope |
| [ ] | [GAP-007](OPEN_QUESTIONS.md#additional-gaps-not-new-approved-decisions) Pilot operations/targets | Important | OPS-001, RPT-001; PRD performance/reliability bars | Named owners, agreed scale and restore objectives |
| [ ] | [GAP-008](OPEN_QUESTIONS.md#additional-gaps-not-new-approved-decisions) Invoice consolidation | Critical | BIL-001, BIL-002, BIL-003, PAY-003, PWA-001 | W1/W3; split due dates |
| [ ] | [GAP-009](OPEN_QUESTIONS.md#additional-gaps-not-new-approved-decisions) Import/invite/upload rules | Important | AUTH-004, IMP-001, OPS-002 | W7; batch replay, invalid-row rollback |
| [ ] | [GAP-010](OPEN_QUESTIONS.md#additional-gaps-not-new-approved-decisions) Exceptional support access | Later | AUTH-003, AUD-001, OPS-002 | W9; feature absent until approved |
| [ ] | [GAP-011](OPEN_QUESTIONS.md#additional-gaps-not-new-approved-decisions) Infrastructure/providers | Important | AUTH-001, OPS-001, OPS-002 | Provider evidence before integration/provisioning |
| [ ] | [GAP-012](OPEN_QUESTIONS.md#additional-gaps-not-new-approved-decisions) Contact requests | Later | PWA-005 (P1), AUTH-002 | Optional feature; no direct credential change |

Use the following record for each decision; marking a review checkbox only confirms discussion, not approval:

```text
Existing decision/gap ID:
Founder name(s) and decision date:
Chosen option, exact parameters and exceptions:
Outcome: awaiting answer / accepted proposal / accepted with changes / rejected / deferred
For a deferral: revisit trigger, owner and disabled/blocked capability:
For a scope impact: explicit PRD change authorization or confirmation of no change:
Accepted worked examples and additional expected values:
Affected requirements/entities/modules:
Required specification updates and their owner:
Implementation gate released (if any):
Approver's explicit statement:
```

The record is an empty template; no accepted outcome has been recorded. For GAP items, preserve their references when recording a future decision, rather than renumbering O-001–O-018.

Final workshop exit checklist:

- [ ] Every critical card has a specific outcome, named owner and approved examples, or remains explicitly blocked with no implementation authorization.
- [ ] Lease end-date display, anchor clamping, first due rule and incomplete final-period amount are answered together.
- [ ] Ordinary billing, correction request, correction approval and payment verification permissions are separately reviewed, including staffing limitations.
- [ ] Claim uniqueness, bank-event duplicate review and retry idempotency are distinguished.
- [ ] Opening balances, deposits, real refunds, withholding and cross-plaza transfers have explicit scope/operational dispositions; no hidden default or “other adjustment” workaround.
- [ ] Representative grants and receipts/unapplied-money visibility are reviewed together.
- [ ] W1–W9 have accepted/revised expected outcomes; screen/export date basis and mathematical totals agree.
- [ ] Important items have deadlines before their modules; later items have containment and revisit triggers.
- [ ] Founders authorize a separate specification-update task before policy-dependent implementation. No source document is automatically rewritten by this workshop.

## 8. Technical foundation work that can begin independently

**Nothing in this section is executed or authorized by Task 003.** “Can begin” means technically separable after a subsequent task explicitly authorizes that work. Initial scaffolding is not the same as final schema or production authentication. Keep unresolved business behavior absent, not implemented behind guessed defaults.

| Candidate foundation task | Why independent / permitted boundary | Remaining gate |
|---|---|---|
| Requirement-to-test inventory, synthetic scenario design and threat-model refinement | Uses existing PRD invariants; can describe denial, retry and audit cases without settling policy | Documentation task authorization; examples with policy-dependent outcomes stay provisional |
| Approved-stack project shell, strict TypeScript, lint/format and test-runner setup | Infrastructure-neutral empty application; no lease/payment schema or working financial endpoints | Separate authorization for scaffolding/dependencies/version selection; no Git initialization unless separately requested |
| Module directories and server-only service boundaries | Names identity/organizations/property/leasing/billing/payments/expenses/reporting/imports/files/audit without fixing business cardinalities | Separate implementation task; do not generate speculative schemas/types that encode blocked choices |
| Exact-money and UTC/business-date utility proposals/tests | Exact arithmetic and UTC instants are existing requirements | Final numeric representation/limits reviewed first; no proration, cadence, due cutoff or recognition policy baked in |
| Reusable accessible UI primitives and synthetic mobile layouts | Navigation, focus, empty/error states and 360px layouts can use synthetic placeholders | Separate UI task; no mock financial actions presented as approved business flows |
| Public PWA shell and offline-unavailable state | Browser usability and no default private financial caching are already specified | Separate implementation task; private routes disabled until authorized identity/resource checks exist |
| Deny-by-default authorization interfaces and negative-test harness | Supports no-access behavior without deciding role approvals | No production allow rules until O-014/O-018/GAP-006 and relevant action policies are settled |
| Redacted logging/error contracts, request IDs and idempotency interface design | Safe cross-cutting mechanics do not require finance policy | No final obligation key, receipt sequence, transaction model or infrastructure provisioning until corresponding gates resolve |
| CI/runbook design and provider evaluation criteria | Plans quality checks and recovery evidence without making external commitments | Provider choice, budget, live targets and actual configuration need GAP-007/GAP-011 approval and a separate task |

Do not start final Prisma schema/migrations, lease overlap rules, invoice scheduling, payment approvals, cross-plaza allocation, opening financial import, refund/tax handling, destructive retention or exceptional support access before their decisions and implementation authorization. A database connection experiment or synthetic fixture is not approval of the domain schema. Use synthetic data only until onboarding/privacy/operations gates are met.

## 9. Deliverable boundary and review checks

Task 003 creates only this workshop document. It does not change DECISIONS, PRD, SRS, the role matrix, the database/API outlines, AGENTS or the MVP scope. No founder decision is marked approved. No application code, migrations, dependencies, infrastructure or Git initialization are part of this task.

Document checks for the handoff: verify all 18 O IDs and 12 GAP IDs occur exactly once in the traceability checklist; 22 critical cards contain problem/options/recommendation/trade-offs/impact/acceptance/status; referenced requirement IDs exist; W1–W9 cover the requested scenarios; links resolve; source file fingerprints remain unchanged. Worked arithmetic can be checked independently, but these document checks are not application/security tests or founder validation.
