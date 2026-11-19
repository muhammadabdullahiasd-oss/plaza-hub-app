# Conceptual database design

Status: DRAFT / PROVISIONAL, 2026-11-05. This is an entity and integrity design, not a final Prisma schema, SQL definition or migration. Sources: [PRD](PRD.md), [SRS](SRS.md), [permissions](ROLES_PERMISSIONS.md), [decisions](DECISIONS.md) and [open questions](OPEN_QUESTIONS.md).

## Boundaries and vocabulary

Use one PostgreSQL database behind a modular service layer and Prisma. Customer organization is the isolation boundary. A shop tenant is a business/person renting space, not an organization membership or authentication identity. A login may have separate memberships; it must not merge business records across organizations (O-018 unresolved).

All organization-owned records carry an explicit organization reference, including relationship tables, financial details, evidence, jobs and audit events. Composite foreign keys should establish `(organizationId, referencedId)` consistency; include plaza consistency where applicable. Query filtering and database constraints complement rather than replace server authorization. Database row-level security is a defense-in-depth option to evaluate before final implementation; it is not assumed configured, and connection pooling/context resets must be tested if adopted.

## Identity, membership and representation

| Entity | Conceptual fields/responsibility | Relationships |
|---|---|---|
| User | Global login identity; credential/provider reference, activation; never the shop business record | 1:N AuthSession; 1:N OrganizationMembership |
| AuthSession | User, expiry/revocation and secure session metadata | Belongs to User; no persistent merged org authorization |
| Organization | Customer organization, display/legal metadata, lifecycle | 1:N plazas, memberships and business records |
| OrganizationMembership | User + organization, active/revoked state | N:1 User/Organization; 1:N scoped role grants |
| RoleGrant / StaffPlazaAssignment | Membership, role, org-wide or explicit plaza scope | Same-org membership/plaza; grant scope remains attached to each role |
| Invitation | Intended org, recipient, permitted role/scope, token digest, expiry/acceptance | Optional accepted membership; no grants above inviter authority |
| ShopTenant | Organization-owned renting person/business, legal/display name, contacts | 1:N leases; no automatic identity match |
| TenantRepresentative | Organization-owned relationship between membership and ShopTenant; status and attribution | Conceptually allows distinct representatives; final cardinality BLOCKED on GAP-006 |
| TenantResourceGrant | Explicit permitted leases/resources and visibility for a representative | Scope level/revocation rules BLOCKED on GAP-006 and O-016/O-018 |

Contact details do not establish authorization. A ShopTenant may exist before any login is invited. A representative's revoked membership/grant blocks access without deleting leases, financial data or actor history. Multiple representatives, lease-limited grants and invitations are conceptual options, not approved business cardinalities.

## Property and leasing

| Entity | Conceptual fields | Relationships / unresolved rule |
|---|---|---|
| Plaza | Organization, name/address, operational status | Organization 1:N Plaza |
| FloorOrSection | Organization, plaza, label | Plaza 1:N sections; exact hierarchy not yet fixed |
| Unit | Organization, plaza, optional section, code/type/area, operational state | Plaza 1:N Unit; unit belongs to exactly one plaza |
| Lease | Organization, unit, ShopTenant, dated agreement/status, contracting party references | Unit/ShopTenant 1:N historical leases in baseline; final exclusivity/co-tenancy BLOCKED O-001/O-002 |
| LeaseTermVersion | Lease, effective interval, rent/cadence/due-rule snapshot, reason/actor | Lease 1:N immutable historical versions; dates/proration BLOCKED O-003/O-004 |
| LeaseDocument | Organization, lease/version, FileAsset, confidentiality | Explicit typed attachment relation |

Occupancy is derived from applicable dated leases and operational status, not an independently editable financial fact. The out-of-service conflict/denominator remains BLOCKED on GAP-005. A renewal retains old references; choosing new Lease versus new LeaseTermVersion depends on legal agreement semantics O-001/O-003.

## Billing and financial records

| Entity | Conceptual responsibility and relationships |
|---|---|
| ChargeType | Organization-owned approved rent/service category; 1:N charge rules and invoice lines |
| RecurringChargeRule | Lease/unit eligibility, category, exact amount and schedule; policy BLOCKED O-003/O-006 |
| BillingObligation | Proposed stable identity for lease/rule/period/occurrence to prevent duplicate issuance; can have linked correction/reissue history without losing identity |
| Invoice | Organization, debtor ShopTenant, proposed lease/plaza context, issuance reference/state, immutable issue snapshot; 1:N InvoiceLine; consolidation BLOCKED GAP-008 |
| InvoiceLine | Category, unit/lease/term-version references, period/due-date inputs, exact amount, issued description; preserves historical source values |
| InvoiceAdjustment | Typed signed effect with original invoice, approval/reason/actor/effective date; correction policy BLOCKED O-004/O-015 and GAP-004 |
| PaymentClaim | Submitted assertion: organization, debtor, asserted amount/date/reference, claimant, review state; 1:N ClaimEvidence and review history; NOT collected funds |
| ClaimReviewEvent | Verification/rejection/cancellation outcome, actor/time/reason and original claim; cancellation/edit policy BLOCKED O-007 |
| VerifiedPayment | Authoritative verified funds, organization/debtor, source claim, received/verified times, verifier and unique payment reference; at most one per source claim |
| PaymentAllocation | Links VerifiedPayment to Invoice with exact amount and attribution; many payments may settle an invoice and one payment may settle several invoices |
| AllocationReversal | References original allocation; append-only cancellation of all/part of its effect under approved correction policy |
| PaymentReversal | References original VerifiedPayment with reason, actor and exact effect; distinguish correction reversal from actual bank refund; partial/refund policy BLOCKED O-008/O-009/GAP-004 |
| Receipt | Linked to VerifiedPayment, stable org-unique reference and issued snapshot; current lookup exposes linked reversal/correction, never silently replaces original |
| Expense / ExpenseCorrection | Plaza, category, recorded business date, amount/vendor/description; linked corrections retain original evidence and history |

The PRD's conceptual Payment is separated here into PaymentClaim and VerifiedPayment to prevent an unverified assertion becoming collected cash. Staff-entered transfers follow the same evidence/verification separation; no automatic trusted-staff bypass is proposed. A verified payment's funds can exist without allocation. Unapplied balance is derived from remaining verified funds and effective allocations; it is not silently recognized as invoice settlement or revenue.

Receipt artifacts are outputs of verified funds, not the source of truth. Final receipt multiplicity, numbering and reissue rules await O-010. Payment allocation across plazas and the scope of unapplied funds await GAP-003; do not add a nullable plaza and assume that resolves authorization or reporting.

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

Subscription, gateway, meter and maintenance models are not required for v1.0. Do not create future-product tables speculatively. Retention/deletion across these entities is BLOCKED on O-013.

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

Translate approved Africa/Lagos period boundaries into UTC query bounds once, consistently across reports and exports. Proposed technical interval convention is start-inclusive/end-exclusive, but lease end-date meaning and due-day cutoffs require O-003 approval before implementation. Preserve received date separately from verification time; neither is silently chosen as collection recognition date. GAP-002 must establish report-effective dates, backdating and historical restatement.

## Constraints and indexing plan

- Same-organization composite foreign keys for every tenant-owned relation; same-plaza checks for unit/section and applicable lease references. Child IDs alone are insufficient.
- Unique membership per user/organization; scoped role grants do not expand another grant's scope. Representative uniqueness/cardinality awaits GAP-006.
- Unique unit code within plaza after approved normalization, and organization-unique issued invoice/payment/receipt references.
- Unique claim-to-VerifiedPayment relationship and unique idempotency key in its operation scope. A bank reference is not universally unique: duplicate patterns trigger review, not a global uniqueness assumption.
- Unique billing-obligation business identity; distinguish multiple legitimate same-category charges, version changes, corrections and retries. Final key depends on O-003/O-006/GAP-008.
- Date validity and amount checks. For approved exclusive leases, use a database-backed interval exclusion strategy or equivalent serialized constraint; application pre-check alone cannot prevent a race. SQL migration design, if needed beyond Prisma representation, is future work only.
- Financial aggregates cannot be enforced by simple row checks alone. Serialize/lock affected payment/invoice rows in a deterministic order and recheck balances within the committing transaction.
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

Final schema/migrations are blocked on contracting/exclusivity, billing dates, representative scope, invoice consolidation, payment/plaza attribution and correction semantics: O-001–O-004, O-007–O-010, O-015, O-017/O-018; GAP-001–GAP-006/GAP-008. Deposit scope O-005 and charge inputs O-006 also affect finance entities. See OPEN_QUESTIONS for the complete gates.

Future PostgreSQL integration tests must exercise composite-reference failures, concurrent lease insertion, invoice retry, verify/reject races, over-allocation, reversal rollback and audit failure. Reconciliation fixtures must cover partial payment, surplus and corrected records. No database, schema or tests were created/executed in Task 002.
