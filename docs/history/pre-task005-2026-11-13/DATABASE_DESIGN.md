# Conceptual database design

Status: conceptual design updated 2026-11-05 for [SELECTED WORKING DEFAULTS](DECISIONS.md#current-selected-working-defaults). This is not a final Prisma schema, migration, joint-founder sign-off or legal/privacy validation. [Original design](history/pre-task004-2026-11-05/docs/DATABASE_DESIGN.md) is preserved. Remaining constraints/gates are in [OPEN_QUESTIONS](OPEN_QUESTIONS.md). Task 004 excludes domain workflows and production connections.

## Boundaries and vocabulary

Use one PostgreSQL database behind a modular service layer and Prisma. Customer organization is the isolation boundary. A shop tenant is a business/person renting space, not an organization membership or authentication identity. Shared login identities with separate memberships are selected under O-018; they never merge organization-owned business records or privileges.

All organization-owned records carry an explicit organization reference, including relationship tables, financial details, evidence, jobs and audit events. Composite foreign keys should establish `(organizationId, referencedId)` consistency; include plaza consistency where applicable. Query filtering and database constraints complement rather than replace server authorization. Database row-level security is a defense-in-depth option to evaluate before final implementation; it is not assumed configured, and connection pooling/context resets must be tested if adopted.

## Identity, membership and representation

| Entity | Conceptual fields/responsibility | Relationships |
|---|---|---|
| User | Shared login identity; staff email/password + MFA, tenant phone OTP with optional email/recovery; never the shop business record | 1:N AuthSession; 1:N OrganizationMembership; identifier linking/factors/provider design remains provisional |
| AuthSession | User, expiry/revocation and secure session metadata | Belongs to User; no persistent merged org authorization |
| Organization | Customer organization, display/legal metadata, lifecycle | 1:N plazas, memberships and business records |
| OrganizationMembership | User + organization, active/revoked state | N:1 User/Organization; 1:N scoped role grants |
| RoleGrant / StaffPlazaAssignment | Membership, role, org-wide or explicit plaza scope | Same-org membership/plaza; grant scope remains attached to each role |
| Invitation | Intended org, recipient, permitted role/scope, token digest, expiry/acceptance | Optional accepted membership; no grants above inviter authority |
| ShopTenant | Organization-owned renting person/business, legal/display name, contacts | 1:N leases; no automatic identity match |
| TenantRepresentative | Organization-owned relationship between membership and ShopTenant; status and attribution | Conceptually allows distinct representatives; final cardinality BLOCKED on GAP-006 |
| TenantResourceGrant | Selected explicit per-resource permission for a representative, including safe financial/receipt projections | No tenant-wide/future-resource access inferred; grant administration, multiplicity, renewal/revocation details remain BLOCKED on GAP-006 |

Contact details do not establish authorization. A ShopTenant may exist before any login is invited. A representative's revoked membership/grant blocks access without deleting leases, financial data or actor history. Explicit per-resource grants and authorized summaries are selected; multiple-representative cardinality and grant lifecycle remain unresolved. MFA/OTP challenge/factor/recovery persistence and safe account linking are conceptual identity concerns, not finalized tables. A tenant OTP session must not inherit staff authority without satisfying staff email/password and MFA requirements.

## Property and leasing

| Entity | Conceptual fields | Relationships / unresolved rule |
|---|---|---|
| Plaza | Organization, name/address, operational status | Organization 1:N Plaza |
| FloorOrSection | Organization, plaza, label | Plaza 1:N sections; exact hierarchy not yet fixed |
| Unit | Organization, plaza, optional section, code/type/area, independent physical availability | Plaza 1:N Unit; unit belongs to exactly one plaza; lease-derived occupancy is a separate dimension |
| Lease | Organization, unit, ShopTenant, dated agreement/status, actual landlord/authorized-agent references distinct from managing org | Unit/ShopTenant 1:N historical leases; one exclusive active lease per shop/date range selected under O-001/O-002; exact boundary constraint still to specify |
| LeaseTermVersion | Lease, effective interval, rent/cadence/due-rule snapshot, reason/actor | Lease 1:N immutable historical versions; dates/proration BLOCKED O-003/O-004 |
| LeaseDocument | Organization, lease/version, FileAsset, confidentiality | Explicit typed attachment relation |

Occupancy is derived from applicable dated leases; physical availability is an independent operational dimension (GAP-005). A leased unit can be out of service without changing lease occupancy. Do not implement a single combined enum or the old workshop occupied-precedence count rule. Denominator/display and activation/retirement policy remain open. A renewal retains old references; choosing new Lease versus new LeaseTermVersion and exact date boundaries still requires O-003 detail.

## Billing and financial records

| Entity | Conceptual responsibility and relationships |
|---|---|
| ChargeType | Organization-owned approved rent/service category; 1:N charge rules and invoice lines |
| RecurringChargeRule | Lease/unit eligibility, category, exact amount and schedule; policy BLOCKED O-003/O-006 |
| BillingObligation | Proposed stable identity for lease/rule/period/occurrence to prevent duplicate issuance; can have linked correction/reissue history without losing identity |
| Invoice | Organization, debtor ShopTenant, proposed lease/plaza context, issuance reference/state, immutable issue snapshot; 1:N InvoiceLine; consolidation BLOCKED GAP-008 |
| InvoiceLine | Category, unit/lease/term-version references, period/due-date inputs, exact amount, issued description; preserves historical source values |
| InvoiceAdjustment | Typed signed effect with original invoice, approval/reason/actor/effective date; correction policy BLOCKED O-004/O-015 and GAP-004 |
| PaymentClaim | Immutable submitted assertion: organization/plaza, debtor, asserted amount/transfer date/reference, claimant, review state; 1:N ClaimEvidence/review history and linked replacement claims; NOT collected funds |
| ClaimReviewEvent | Verification/rejection/cancellation outcome, actor/time/reason and original claim; cancellation/edit policy BLOCKED O-007 |
| VerifiedPayment | Authoritative verified funds owned by one organization and one plaza, debtor/source claim, distinct transfer date and verification instant, independent authorized verifier and unique reference; at most one per source claim |
| PaymentAllocation | Links VerifiedPayment to Invoice with exact amount and attribution; many payments may settle an invoice and one payment may settle several invoices |
| AllocationReversal | References original allocation; append-only cancellation of all/part of its effect under approved correction policy |
| PaymentReversal | References original VerifiedPayment with reason, actor and exact effect; distinguish correction reversal from actual bank refund; partial/refund policy BLOCKED O-008/O-009/GAP-004 |
| Receipt | Verified-payment PDF with org-unique reference and issued snapshot; authorization must cover disclosed financial records; current lookup exposes corrections without silently replacing original |
| OpeningBalanceEntry / MigrationBatch | Newly selected conceptual scope for auditable opening arrears/credits with organization/plaza/resource provenance, cutover and reconciliation; names/schema provisional; distinct from current-period Invoice/VerifiedPayment, no fabricated current cash receipt |
| Expense / ExpenseCorrection | Plaza, category, recorded business date, amount/vendor/description; linked corrections retain original evidence and history |

The PRD's conceptual Payment is separated here into PaymentClaim and VerifiedPayment to prevent an unverified assertion becoming collected cash. Staff-entered transfers follow the same evidence/verification separation; no automatic trusted-staff bypass is proposed. A verified payment's funds can exist without allocation. Unapplied balance is derived from remaining verified funds and effective allocations; it is not silently recognized as invoice settlement or revenue.

Receipt artifacts are outputs of verified funds, not the source of truth. Per-organization references and PDF format are selected; multiplicity, numbering format and reissue rules remain open under O-010. One payment belongs to one plaza (GAP-003); allocation cannot cross that plaza boundary. Actual multi-plaza bank transfers require an explicit unresolved reconciliation design, not duplicated full payments. A representative with access to one invoice/allocation is not thereby authorized for the full receipt; deny a full artifact that discloses unauthorized records until a reviewed scoped-delivery design exists.

Opening credits must not be forced into VerifiedPayment just to reuse allocation code. Future design must distinguish verified funds and migrated credit provenance while preventing double spending across both, with PostgreSQL transaction/concurrency protection. Preserve opening debt/credit sources and current-period collection separation; exact allocation/correction/cutover mechanics remain open under GAP-001/GAP-004/GAP-009. Deposit accounting and unrestricted historical ledger replay are outside the selected addition.

## Operational entities

| Entity | Purpose |
|---|---|
| FileAsset | Organization, private storage key, upload status/type/size/digest, uploader and retention metadata |
| ClaimEvidence / ExpenseEvidence / LeaseDocument | Typed foreign keys to parent and FileAsset; avoid unconstrained arbitrary polymorphic IDs |
| AuditEvent | Organization/scope, actor user or job, action/resource references, timestamp, safe change summary, reason, correlation ID |
| ImportJob / ImportRow | Organization/plaza, submitter, input digest/template version, validated preview/errors, commit state/counts |
| ExportJob | Requester, scope, filters/snapshot cutoff, status, private artifact and expiry; reauthorize download |
| IdempotencyRecord | Organization, operation/actor scope, key, request fingerprint, execution/result reference and expiry policy |
| DocumentSequence | Proposed organization/document-type sequence allocation without unsafe max-plus-one numbering; exact format/gap policy O-010 |
| OutboxJob | Proposed transactional pending task for receipt rendering/export/notifications; retries cannot recreate business transactions |

Automated subscriptions, gateways, meters and maintenance remain later-release scope. Selected manual organization commercial/lifecycle policy includes plaza/size tiers and a 30-day expiry read/export grace followed by restricted staff operations; do not model this as automated subscription billing or implement it in Task 004. Exact lifecycle fields/permissions remain to specify. Retention/deletion is BLOCKED on O-013 privacy/legal review; no export/retention durations are selected.

## Exact money and snapshots

- Proposed storage representation: integer kobo in PostgreSQL BIGINT, with integer-safe application handling and decimal-string API transport. The PRD also permits exact decimal numeric storage; choose one consistently before final schema. Never convert through JavaScript floating-point currency arithmetic.
- Currency is NGN for v1.0. Define allowed magnitude and rounding rules before importing/calculating amounts. Fractional-kobo/proration/tax rules remain BLOCKED on O-004/O-017; do not round implicitly.
- Require positive claim/payment/allocation amounts. Define allowed zero-charge and signed-adjustment cases in approved policy; negative payments must not masquerade as reversals.
- Snapshot issued party/header details, line descriptions, exact amounts, periods, due dates, charge types and applicable lease terms. Later profile/lease edits do not rewrite issued documents.
- Calculate invoice debt from issued obligation + valid adjustment effects − effective verified allocation effects. Validate nonnegative debt; reject conflicting writes instead of masking invalid balances with a zero clamp.
- Calculate available payment funds from verified amount − effective payment reversals − effective allocations. Reversal transactions must also correct allocations as needed to preserve this invariant.
- Distinguish outstanding from overdue, verified collections from allocated funds, and recorded expenses from cash paid. Reports must never sum joined allocation rows in a way that multiplies payment amounts.

## Dates and historical interpretation

Store event timestamps (creation, verification, audit, reversal and session expiry) as UTC instants using timezone-aware database timestamp semantics. Render using the user's approved display context, initially Africa/Lagos. Store lease dates, billing periods and due dates as date-only values when they represent business calendar days.

Translate approved Africa/Lagos period boundaries into UTC query bounds once, consistently across reports and exports. Start-inclusive/end-exclusive intervals remain a technical proposal; O-003 did not select lease endpoint semantics, anchoring/clamping or due cutoffs. Verified collections use verification timestamps (GAP-002), with bank-transfer dates retained independently. Reversal posting, backdating, historical restatement, ageing and expense/report cutoffs remain unresolved.

## Constraints and indexing plan

- Same-organization composite foreign keys for every tenant-owned relation; same-plaza checks for unit/section and applicable lease references. Child IDs alone are insufficient.
- Unique membership per user/organization; scoped role grants do not expand another grant's scope. Representative uniqueness/cardinality awaits GAP-006.
- Unique unit code within plaza after approved normalization, and organization-unique issued invoice/payment/receipt references.
- Unique claim-to-VerifiedPayment relationship and unique idempotency key in its operation scope. A bank reference is not universally unique: duplicate patterns trigger review, not a global uniqueness assumption.
- Unique billing-obligation business identity; distinguish multiple legitimate same-category charges, version changes, corrections and retries. Final key depends on O-003/O-006/GAP-008.
- Date validity and amount checks. For selected exclusive leases, use a PostgreSQL-backed interval exclusion strategy or equivalent serialized constraint; application pre-check alone cannot prevent a race. Exact boundaries/migration design remain future work; no migration is created by this update.
- Critical financial operations require PostgreSQL transaction and concurrency protection. Financial aggregates cannot be enforced by simple row checks alone. Serialize/lock affected payment/invoice/opening-credit resources in a deterministic order and recheck authorization, approval and balances within the committing transaction; exact mechanism is a technical design choice to validate with concurrent tests.
- Restrict deletion of financial/audit ancestors; use archival or explicit corrective history. Do not cascade-delete invoices when deactivating a user, tenant or plaza.
- Candidate indexes begin with organization and frequently filtered plaza/debtor/date/status fields; index foreign keys and obligation/idempotency lookups. Validate query plans with the approved pilot dataset, not guessed production scale.

## Transaction boundaries and races

| Workflow | Atomic database boundary | Retry/failure behavior |
|---|---|---|
| Lease creation/change | Verify scope/version; validate compatible interval; persist lease/version and audit | One incompatible concurrent lease wins; stale version fails |
| Invoice issue | Revalidate draft/source terms; acquire obligation identity/reference; store snapshot/lines and audit | Same operation replay returns existing result; changed request fingerprint conflicts |
| Claim verification | Check pending state/approver; create unique VerifiedPayment; store review/audit and receipt task | Verify/reject race has one valid outcome; no duplicate funds |
| Allocation | Lock affected funds/invoices; recheck org/debtor/scope and balances; append allocations and audit | Two requests cannot spend the same remaining funds or overpay an invoice |
| Reversal/correction | Lock original records/affected balances; append reversal/adjustment and related allocation effects, audit and receipt-status effect | All effects commit together or none; repeat cannot reverse twice; exact allowed operation BLOCKED GAP-004 |
| Expense correction | Preserve original, add approved correction and audit | Stale update conflict; no unaudited overwrite |
| Import commit | Reauthorize/revalidate preview; apply approved atomicity policy; record result/idempotency/audit | Preview is non-mutating; matching/partial commit BLOCKED GAP-009 |

Do not hold database transactions open while checking external bank records, uploading files or rendering PDFs. Stage uploads privately, attach validated assets through authorized records and clean orphans under the future retention policy. Commit an outbox record with business state when post-commit work is needed; rendering retry reuses the same authoritative receipt/reference. Reauthorize jobs at execution; expired/revoked grants must not produce accessible exports.

## Final-schema gates and verification plan

Selected modeling boundaries now include actual contracting party, exclusive leases, separate occupancy/availability, per-resource grants, isolated shared identities, one-plaza verified payments and narrow opening arrears/credits. Final domain schema/migrations still need date boundaries/scheduling, representative lifecycle, invoice consolidation (GAP-008 unmapped), approval/correction transactions, opening-credit allocation and import policy. Authentication factors/recovery/providers also need detail before integration. See OPEN_QUESTIONS for residual gates; selected high-level rules do not settle every column/state transition. No lease/billing/payment/subscription workflow is authorized in Task 004.

Future PostgreSQL integration tests must exercise composite-reference failures, concurrent lease insertion, invoice retry, verify/reject races, over-allocation, reversal rollback and audit failure. Reconciliation fixtures must cover partial payment, surplus and corrected records. No database, schema or tests were created/executed in Task 002.
