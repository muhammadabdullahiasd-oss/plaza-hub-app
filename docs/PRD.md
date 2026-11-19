# PlazaHub — Product Requirements Document (PRD)

> **Document status:** Specification incorporating selected working defaults; not both-founders sign-off or legal/privacy validation  
> **Document revision:** 0.2 — owner-delegated selection update, 2026-11-05  
> **Target product release:** v1.0 MVP  
> **Prepared:** 2026-11-05  
> **Working product name:** PlazaHub (renameable)  
> **Product validation:** Tracked separately as v0.1; not a prerequisite to drafting this specification.

Revision 0.1 is preserved in [history](history/pre-task004-2026-11-05/docs/PRD.md). [DECISIONS](DECISIONS.md#current-selected-working-defaults) records the exact authority, rationale, impacted IDs and remaining questions. Requirement IDs/priorities are unchanged. The explicit MVP scope addition is auditable opening arrears and credits under IMP-001; no deposit accounting, tax engine or automated subscription workflow is added. Selected rules are not implementation or production approval.

## 1. Executive summary

PlazaHub is a multi-organization SaaS platform for operating commercial plazas and shopping complexes in Nigeria. The primary paying customer is a plaza owner or commercial property management organization. Daily users include property managers and accountants; shop tenants access a mobile-first Progressive Web App (PWA).

**Central promise:** An authorized owner can see which shops are occupied, what has been billed and collected, which accounts are overdue, and what the plaza has spent—without manually consolidating spreadsheets or waiting for phone updates.

**v1.0 scope:** Plaza/shop registry, tenant/lease records, rent and service-charge invoices, manual payment verification and partial payments, receipts, expenses, owner reports, secure roles/audit events, CSV import/export including the selected narrow auditable opening-arrears/credit addition, and a tenant PWA. Automated gateways, advanced maintenance, metering integrations and self-service SaaS subscriptions are later releases.

The PRD establishes *what* must be true for the product to be usable. It does not yet prescribe every database column, API payload or deployment configuration; those belong in the SRS, database specification and technical design.

## 2. Goals, non-goals and guiding principles

### 2.1 Product goals
1. Create an accurate, inspectable source of truth for commercial plaza units, leases, invoices, payments and expenses.
2. Reduce the owner's dependence on verbal updates and disconnected records.
3. Let authorized staff complete everyday plaza billing and reconciliation workflows.
4. Let tenants use a responsive website or installable PWA on Android/iPhone to see their own charges and verified receipts.
5. Make the architecture safe for multiple independent customer organizations from the start.
6. Keep onboarding practical for a pilot plaza with existing spreadsheet data.

### 2.2 Explicit v1.0 non-goals
- Automatic collection or payout of rent using a payment gateway.
- Full double-entry general ledger, tax filing or replacement for enterprise accounting software.
- Automated smart-meter readings, generator telemetry or IoT devices.
- Full maintenance ticket routing, contractor procurement or asset lifecycle management.
- Push notifications, WhatsApp automation and native Android/iOS apps.
- Marketplace/listings, estate or short-let property workflows.
- Self-serve pricing, automated SaaS subscriptions, complex enterprise SSO or white-label domains.
- AI chatbots, predictive analytics or multi-currency support.

### 2.3 Principles
- **Correct finances first:** No unverified receipt is treated as collected cash.
- **Organization isolation:** No cross-organization data access, including through reports, search, imports, exports or files.
- **Mobile-first for tenants:** Core tenant tasks should be usable on small phones and slow connections.
- **Traceability:** Financial changes have identifiable actors, times and reasons; issued records are not silently overwritten.
- **Configurable but constrained:** Avoid building a generic rule engine before pilot needs are known.

## 3. Audience and user roles

> Terminology: A **customer organization** subscribes to PlazaHub; a **shop tenant** rents retail space from that organization. These are distinct types of 'tenant'.

| Persona | Primary job | Typical device | Key needs |
|---|---|---|---|
| Platform operator (SaaS Super Admin) | Provision/support customer organizations | Desktop | Organization status, support administration, no default unrestricted financial access |
| Portfolio owner / authorized asset owner | Oversight across owned or managed plazas | Desktop, tablet, phone | Collections, arrears, expenses, occupancy, audit visibility |
| Plaza manager | Operate one or more assigned plazas | Laptop, phone | Shops, occupants, leases, bills, follow-ups |
| Accountant / cashier | Reconcile obligations and received payments | Laptop | Invoices, verification, payment allocation, receipts, adjustments |
| Shop tenant | Understand what they owe and what is paid | Phone PWA | Bills, due dates, verified payments, receipts, unit and lease summary |

Authorization is based on **organization membership + role + plaza scope + resource relationship**. A shop tenant can only see explicitly linked leases/units, not all records in the plaza. One person may hold multiple roles or memberships; switching context must not merge data.

## 4. Product boundary and tenancy model

- A **customer organization** may manage multiple plazas.
- A **plaza** may have floors/sections; each **unit/shop** belongs to exactly one plaza.
- A **shop tenant profile** may have multiple leases and multiple units within the customer organization.
- A **lease** connects the shop tenant and unit with dated terms; historical leases remain readable.
- Operational staff may have plaza-limited memberships.
- Organization-owned financial records always carry an explicit organization reference, with database constraints and server-side checks.
- The application uses one modular backend in v1.0, with logical separation for organizations, property, leasing, billing, payments, expenses, reports and tenant portal.

## 5. End-to-end journeys

### J1 — Create a plaza and its units
A platform operator provisions a customer organization. An authorized owner sets up plaza details, floors and unit identifiers, then invites staff. Existing unit lists may be imported from CSV. The manager maintains physical availability independently of lease-derived occupancy. A shop may be occupied and physically out of service simultaneously; operational labels cannot conceal an active lease (GAP-005).

### J2 — Register a shop tenant and assign a lease
The manager creates or selects the tenant profile, assigns one or more units through dated leases, specifies periodic rent and due-date terms, and attaches an optional lease document. The system checks for incompatible overlapping active exclusive leases for the same unit. Lease renewal creates a history rather than deleting the old terms.

### J3 — Bill rent and service charges
An authorized staff user issues a scheduled or manually prepared invoice for rent or approved service charges. Invoice lines show the charge type, unit/lease, amount, billing period and due date. Staff can preview invoices before issuing. A system-generated operation must not accidentally issue duplicate invoices for the same obligation period.

### J4 — Record and reconcile a bank-transfer payment
An accountant records a transfer reference, date, amount and optional evidence; or reviews a tenant-submitted payment claim. The entry stays **Pending** until an authorized staff user verifies it against the organization's bank records. The accountant allocates all or part of the verified amount to outstanding invoices. A receipt is issued only for verified funds. Any reversal is traceable and recalculates balances.

### J5 — Record plaza operating expenses
An owner or authorized staff user records diesel, electricity, security, cleaning, repairs or other expenses, including date, vendor/description, amount and optional evidence. Reports distinguish **cash collected** from **expenses recorded** and present the selected reporting period consistently.

### J6 — Owner checks financial and occupancy position
The owner selects a plaza or portfolio and date range and sees collected payments, outstanding invoice balances, occupied/vacant units, and operating expenses. They can drill into individual unpaid accounts and export reconciliable reports. A number on the dashboard must always be explainable by underlying records.

### J7 — Shop tenant uses the mobile PWA
The tenant opens a secure link or installs the PWA from a supported mobile browser, signs in, sees their assigned shop(s), invoices, outstanding balances and verified receipts, and may submit a payment claim (not an automatic confirmation). If connectivity is unavailable, the app displays a clear offline state and never presents stale balances as current.

## 6. Functional requirements for v1.0

**Priority:** P0 = needed for pilot-ready MVP; P1 = desirable if implementation allows, not a launch blocker. IDs remain stable as the SRS becomes more detailed.

### 6.1 Access, accounts and isolation

**AUTH-001 [P0] — Secure authentication.** Staff use email/password and MFA; tenants use phone OTP with optional email and secure recovery (O-014, SELECTED WORKING DEFAULT). Users can sign out, recover access securely and access only authorized areas. Staff identities are attributable in audit events. Optional tenant email is not an automatic alternative authentication bypass; mixed-role staff access must satisfy staff authentication requirements.  
**Acceptance:** Unauthenticated requests to private routes/APIs fail; sessions expire/revoke; tenant cannot open staff screens by changing URL.

**AUTH-002 [P0] — Scoped roles.** Support Platform Operator, Owner, Manager, Accountant and Shop Tenant; owner/manager/accountant permissions are limited by organization and assigned plaza(s).  
**Acceptance:** A user assigned Plaza A cannot retrieve Plaza B's protected records unless explicitly granted scope.

**AUTH-003 [P0] — Strict organization isolation.** Reads, writes, exports, attachments and background operations enforce customer organization boundaries.  
**Acceptance:** Automated cross-organization access tests fail closed, including guessed record IDs and modified API parameters.

**AUTH-004 [P0] — Staff invitations.** Authorized owners can invite or deactivate staff access without deleting financial history.  
**Acceptance:** Deactivated staff cannot authenticate to the former scope; their previous audit events remain attributable.

### 6.2 Plaza, unit and tenant registry

**PLZ-001 [P0] — Organization/plaza registry.** Platform operator provisions a customer organization; owner maintains one or more plazas with address and operational status.  
**Acceptance:** Two organizations can independently use the same shop code without cross-data collisions.

**PLZ-002 [P0] — Unit inventory.** Manage floors/sections and unique unit identifiers, unit type, optional area and operational status.  
**Acceptance:** Unit codes are unique within a plaza; unit history remains after it is retired.

**TEN-001 [P0] — Shop tenant profiles.** Store legal/display name, organization/type, contact details and approved documents; link multiple leases to one tenant. Keep shared login identities separate from isolated organization-owned tenant records and explicit per-resource representative grants (O-018, GAP-006).  
**Acceptance:** One tenant can rent two units; manager can locate their complete invoice/lease history within their organization.

### 6.3 Leases and occupancy

**LSE-001 [P0] — Dated leases.** Record unit, tenant, actual contracting landlord or authorized agent distinct from the managing organization, start/end dates, rent amount, billing frequency (monthly, quarterly or annual), per-lease due dates and lease status. One exclusive active lease per shop/date range is selected (O-001–O-003); exact interval/first-bill mechanics remain open.  
**Acceptance:** An overlapping exclusive active lease cannot be saved for the same unit/date range; expired lease remains in history.

**LSE-002 [P0] — Lease changes with history.** Authorized users can renew/terminate leases, with reason, effective date and change audit.  
**Acceptance:** Past invoices/payments remain linked to the applicable lease version; renewal does not rewrite earlier history.

**LSE-003 [P0] — Occupancy calculation.** Model lease-derived occupancy and physical availability independently for an effective date (GAP-005). Show occupied/vacant and physical out-of-service status as separate dimensions, with any overlap explicit.  
**Acceptance:** A unit with an applicable active lease counts as occupied even when physically out of service; neither status overwrites the other. The display must not imply overlapping dimension counts sum to the total inventory. Occupancy-rate denominator and activation/retirement rules remain open.

### 6.4 Invoicing and service charges

**BIL-001 [P0] — Rent invoices.** Generate period-specific rent obligations from lease terms, with preview and issue states.  
**Acceptance:** A repeated run does not create duplicate obligations for the same lease/period/charge type; amounts and due dates are inspectable.

**BIL-002 [P0] — Service-charge invoices.** Support fixed recurring charges and authorized manually entered per-unit allocations for electricity, generator/diesel, security, cleaning and other categories.  
**Acceptance:** Every charge line has category, amount, affected unit/lease, period and optional notes; no invisible automatic allocation.

**BIL-003 [P0] — Invoice lifecycle.** Draft, Issued, Partially Paid, Paid, Overdue and Voided states are represented consistently; issued invoices are preserved and amounts are not silently edited. Corrections/reversals and audited manual adjustments replace overwrites; no automatic proration (O-004, GAP-004). Sensitive changes require approval gates under O-015; exact action/approver mechanics remain open.  
**Acceptance:** Changing an issued amount requires a traceable void/correction process; tenant sees the updated authoritative status.

**BIL-004 [P0] — Partial payment and balances.** Invoice outstanding = issued amount + valid adjustments − verified payment allocations, with nonnegative invoice due and explicit handling of unallocated surplus.  
**Acceptance:** A ₦200,000 invoice with a verified ₦75,000 allocation shows ₦125,000 outstanding; pending transfers do not decrease balance.

### 6.5 Payments, receipts and expenses

**PAY-001 [P0] — Manual payment evidence.** Staff may record a bank-transfer entry; tenants may submit a payment claim with reference and optional image/document. Submitted claims are immutable; correction requires cancellation or rejection and linked resubmission (O-007). Keep claims separate from verified payments; one payment belongs to one plaza (GAP-003).  
**Acceptance:** New tenant claims are shown as Pending and cannot generate a confirmed receipt or alter collected totals.

**PAY-002 [P0] — Authorized verification.** Only authorized Accountants or Owners verify payments after external checking, with verifier and timestamp; staff cannot self-approve submitted transactions (O-008). Keep rejection authority explicit in the action matrix. Verified collections use verification timestamps; retain bank-transfer dates separately (GAP-002).  
**Acceptance:** Duplicate reference/amount patterns trigger a review warning; a verified payment is not double-counted by retries.

**PAY-003 [P0] — Payment allocation and receipt.** Verified payment may be allocated to one or more eligible invoices within its plaza; unallocated funds remain visible and auditable. Generate verified-payment PDF receipts with per-organization references. A receipt must not reveal financial records outside the representative's explicit resource scope (O-009, O-010, GAP-003, GAP-006).  
**Acceptance:** Payment allocation totals cannot exceed verified payment amount; overpayment remains visible as unapplied credit rather than disappearing.

**PAY-004 [P0] — Corrective reversal.** Corrections to verified payments use a reasoned reversing record with audit, not silent deletion.  
**Acceptance:** After reversal, relevant balances and reports recalculate and original receipt shows its corrected/reversed state.

**EXP-001 [P0] — Operating expenses.** Authorized staff create and categorize dated expense records linked to plaza; corrections are audited.  
**Acceptance:** Expense totals can be reproduced from the transaction list and date filter.

### 6.6 Reporting and data movement

**RPT-001 [P0] — Owner overview.** Show occupied/vacant/out-of-service units, invoiced obligations, verified collections, outstanding amounts and operating expenses for selected organization/plaza/date range.  
**Acceptance:** Every metric drills down or links to a report that reconciles to the displayed total; pending payments excluded from verified cash.

**RPT-002 [P0] — Operational reports.** Aged receivables by shop tenant, invoice status, payment ledger and expenses by category.  
**Acceptance:** Exported report totals match on-screen totals for the same filters and cutoff.

**IMP-001 [P0] — Data import/export.** CSV import of units/tenants/leases plus the explicitly authorized narrow addition of auditable opening arrears and credits, with preview, validation and error report; CSV export of key registers and reports. Deposit accounting and full historical ledger replay are not added (GAP-001, O-005).  
**Acceptance:** Bad rows are explained, not silently accepted; imports are scoped to the correct organization and produce an audit event. Opening arrears/credits retain provenance and reconciliation totals and are not treated as new current-period billings, verified cash collections or newly verified-payment receipts. Exact cutover, due-date, credit-allocation and commit policies must be settled before implementation.

### 6.7 Tenant PWA

**PWA-001 [P0] — Mobile-first tenant portal.** Authenticated tenants see only their own assigned shop(s), lease summary, invoices and outstanding balances.  
**Acceptance:** Usable on supported Android and iPhone browsers at 360px viewport; no horizontal scrolling for primary tasks.

**PWA-002 [P0] — Verified payment history and receipts.** Tenant can see payment statuses and download receipts for verified funds.  
**Acceptance:** Pending/submitted claims are clearly labeled and never described as paid/settled.

**PWA-003 [P0] — Installable app shell.** Valid web manifest, icons, HTTPS and service worker support an app-like launch where browsers permit installation.  
**Acceptance:** Installability tested on representative Android and iPhone devices; full app remains usable as normal website without installation.

**PWA-004 [P0] — Connectivity and cache safety.** Display clear offline or stale-data messaging; do not persist sensitive financial snapshots in shared caches by default.  
**Acceptance:** App must not show an old balance as current when offline; authentication and server authorization remain required for private data.

**PWA-005 [P1] — Tenant profile requests.** Tenant may request a change to phone or business contact information, subject to staff confirmation.

### 6.8 Operations and audit

**AUD-001 [P0] — Activity trail.** Capture who/what/when for sensitive data changes and all financial verifications, voids and reversals.  
**Acceptance:** Owner can review event history for a payment or invoice, including original references and correction reasons.

**OPS-001 [P0] — Backup, restore and monitoring.** Production database and file storage have documented backup/recovery practices, error monitoring and a demonstrated restore procedure.  
**Acceptance:** Restore test succeeds in a non-production environment before first live launch.

**OPS-002 [P0] — Protected file handling.** Tenant documents and payment evidence use private object storage and short-lived authorized download access.  
**Acceptance:** A copied private file URL does not grant long-lived cross-user access.

## 7. Permissions matrix (initial policy)

Legend: **A** = administer; **E** = create/update within permitted scope; **V** = view; **—** = no access. Additional approval/reversal permissions are explicitly restricted.

| Resource / action | Platform operator | Owner | Manager | Accountant | Shop tenant |
|---|---|---|---|---|---|
| Organization provisioning | A | — | — | — | — |
| Plaza/units | Support metadata only | A | E | V | Own unit V |
| Tenant/lease records | — by default | A | E | V | Own summary V |
| Issue invoices | — | A | E | E | V own |
| Record payment claim | — | E | E | E | Own claim E |
| Verify/reverse payments | — | A | — | E* | — |
| Expense records | — | A | E | E | — |
| Reports and exports | — by default | A | Assigned plaza V | Assigned plaza V | Own records V |
| Staff access | Provisioning support | A | — | — | — |
| Audit history | Support metadata only | V | Limited V | Finance events V | — |

`*` Staff cannot self-approve submitted transactions; only authorized Owners/Accountants verify payments (O-008). Sensitive adjustments, reversals and refunds require approval gates (O-015); detailed rejection/reversal/refund execution permissions remain unresolved. Lack of a second approver does not create an exception. Platform support access to customer financial data requires an exceptional, time-limited and audited approval process—not routine super-admin powers. The current [permission matrix](ROLES_PERMISSIONS.md) distinguishes selected constraints from provisional actions.

## 8. Key financial and operational rules

1. Store NGN financial amounts as integer **kobo** (or exact decimal numeric representation), never floating-point currency arithmetic.
2. Distinguish **invoiced**, **due**, **verified collected**, **pending**, **refunded/reversed**, **unapplied credit**, and **expenses**; do not label all of them 'revenue'.
3. An invoice is the payable obligation; a payment is evidence of collected funds; an allocation links verified payment to one or more invoices.
4. Unverified tenant transfer claims are not proof of payment and do not generate final receipts.
5. Financial records are append/correct by auditable reversal, not destructively edited.
6. Billing issuance and payment processing are **idempotent**; retries must not double bill or double count.
7. Organization-scoped records cannot reference a unit, lease, user assignment or invoice from another organization.
8. Every issued invoice and verified payment has an organization-unique human-readable reference.
9. Reports must specify reporting period, timezone and whether figures represent billed obligations or cash movements; Nigeria operations use `Africa/Lagos` as the initial business timezone.
10. Staff can reconcile legitimate overpayments and unallocated funds without hiding balances. Exact credit/refund policies are open decisions (see DECISIONS.md).
11. Critical financial operations require PostgreSQL transaction and concurrency protection; persistent business-key/idempotency controls must protect against races and retries, not merely disabled UI buttons.
12. Deposit accounting is deferred beyond v1.0. Manual tax lines require review; no automated tax engine or validated tax treatment is assumed (O-005/O-017).
13. Subscribing organizations are charged on plaza/size tiers and manually provisioned initially. A 30-day read/export grace follows subscription expiry, then restricted staff operations; detailed lifecycle permissions remain open. No subscription business workflow is part of Task 004 (O-011/O-012).
14. Cancellation export and retention windows require privacy/legal approval before production. No numerical windows have been supplied or validated; the subscription grace is not a retention/deletion schedule (O-013).

## 9. Data objects (conceptual—not final schema)

- Identity: User, AuthSession, Organization, OrganizationMembership, StaffPlazaAssignment, Role/Permission.
- Property: Plaza, FloorOrSection, Unit.
- Occupancy: ShopTenant, Lease, LeaseTermVersion, LeaseDocument.
- Financial: ChargeType, RecurringChargeRule, Invoice, InvoiceLine, Payment, PaymentEvidence, PaymentAllocation, Receipt, ReversalOrAdjustment, Expense.
- Compliance/operations: AuditEvent, FileAsset, ImportJob, ExportJob, NotificationPreference (future), OrganizationSubscription (future).

Important relationships: Organization 1:N Plaza; Plaza 1:N Unit; ShopTenant 1:N Lease; Unit 1:N historical Lease; Lease 1:N Invoice; Invoice 1:N InvoiceLine and 1:N PaymentAllocation; verified Payment 1:N PaymentAllocation. Organization-level composite constraints and defensive checks must maintain consistency.

## 10. UX and information architecture

### 10.1 Plaza management web
- Overview / reports
- Plazas → floors/sections → units
- Shop tenants and leases
- Billing → invoices / service charges / receivables
- Payments → pending verification / verified / receipts / reversals
- Expenses
- Imports and exports
- Staff and settings
- Audit activity (authorized viewers)

### 10.2 Tenant mobile PWA
- **Home:** Shop selector (if multiple), amount currently outstanding, next due date, payment status.
- **Bills:** Invoice list and invoice detail.
- **Payments:** Submit transfer claim, view pending/verified/rejected statuses, view verified receipts.
- **My shop:** Unit and lease summary, contacts.
- **Account:** Sign out and support/contact information.

The tenant experience must be functional *without* installation; installation is optional. The primary action should require minimal taps. Keep file upload size and bandwidth reasonable.

## 11. Non-functional requirements and release quality bars

| Category | v1.0 expectation |
|---|---|
| Security | HTTPS; secure credentials/session handling; least privilege; scoped authorization on every read/write; rate limiting; private attachments |
| Data isolation | Automated negative tests across at least two different organizations, roles, plazas and files |
| Integrity | Transactional financial writes; idempotency; immutable audit trail for financial actions; exact money arithmetic |
| Performance target | On pilot-sized data, common authenticated pages aim for p95 navigation/data response under ~2 seconds on a reasonable connection; measure rather than promise |
| Mobile UX | 360px–430px responsive tenant layouts; usable touch targets; readable bills and status indicators |
| Accessibility | Keyboard focus, labels and contrast; aim for WCAG 2.2 AA where practicable, record exceptions |
| Compatibility | Current supported Chrome/Android and Safari/iOS; test on actual devices before release |
| Reliability | Monitored errors and backup/restore procedures; defined incident contact and manual reconciliation fallback |
| Privacy | Purpose limitation, least data collection, controlled document access, retention/deletion policy to be drafted before live onboarding |
| Testing | Unit tests for calculations/permissions; integration tests for transactional workflows; E2E smoke tests for owner/accountant/tenant |
| Auditability | Admin can investigate how a number changed without direct database edits |

## 12. Suggested pilot demonstration script

1. Log in as Owner: two plazas appear; open Plaza A with 40 units.
2. Manager registers a shop tenant, creates an annual lease for Unit A-12.
3. Accountant generates a ₦600,000 rent invoice and ₦40,000 service-charge invoice for that shop.
4. Tenant opens the PWA, views both items, uploads proof claiming ₦250,000 transfer.
5. Tenant sees **Pending**; owner dashboard collection totals remain unchanged.
6. Accountant verifies the transfer against bank records and allocates ₦250,000 to rent.
7. Tenant sees verified ₦250,000 receipt; rent remaining = ₦350,000, service charge due = ₦40,000; total outstanding = ₦390,000.
8. Owner drills from ₦390,000 arrears to the two invoice lines and the payment allocation.
9. Accountant exports the payment register; figures reconcile to the dashboard.
10. Attempted cross-organization API and file access is denied.

All values in this script are illustrative test data.

## 13. Release acceptance criteria

v1.0 is considered pilot-ready only when:
- All P0 requirements are implemented or a documented, founder-approved exception exists.
- Core demo J1–J7 succeeds using seeded and imported data.
- Financial calculations, partial payment, reversal, duplicate retry and export tests pass.
- A tenant is unable to see another tenant's shop, and an organization cannot see another organization's data.
- Tenant PWA works in browser and can be installed where browser support permits; offline mode never misrepresents account balances.
- Database restore and monitoring are tested; team has an incident and rollback procedure.
- At least one end-to-end rehearsal uses approved representative data and reconciles results against independently calculated expected totals.
- The team can explain onboarding, monthly support and who owns operational errors.

## 14. Assumptions, dependencies and risks

**Current assumptions (subject to founder/pilot confirmation):** Nigeria-first, NGN only, commercial shops, one organization operating multiple plazas, monthly/quarterly/yearly rent, fixed/manual service charges, manually verified transfers, tenant PWA, platform-provisioned customer organizations.

**Dependencies:** Reliable invoice and lease terms, a bank-transfer verification process defined by each customer, secure document storage, usable mobile devices, a safe data migration template and customer permission to store their records.

**Top risks and mitigations:**
- Customers have inconsistent rent/service-charge policies → begin with constrained rules and document exceptions.
- Manual verification creates fraud or mistakes → pending/verified states, duplicate warnings, separation of duties and audit.
- SaaS data leak → row-level access design, file scoping and cross-tenant tests.
- Too much scope for two founders → defer gateways, maintenance, smart meters and subscription automation.
- Difficult migration → CSV mapping, validation preview, trial imports and reconciliation.
- Tenant connectivity issues → lightweight mobile pages, explicit offline state and optional installation.

## 15. Product success measures (pilot operations, not market validation)

Track: successful onboarding rate; time to import a plaza; percentage of invoices issued without manual correction; payment-to-invoice reconciliation accuracy; owner report reconciliation discrepancies; number of unauthorized access incidents; tenant task completion on phones; critical support incidents; and repeat monthly use by owner/accountant.

Proposed hard quality bar: **zero unexplained financial discrepancies** and **zero known cross-organization authorization leaks** at pilot launch. Business demand validation is deliberately tracked separately.

## 16. Next specifications to create

1. **SRS.md:** Detailed field validation, state machines, invoice periods, payment allocation/reversal edge cases, exact acceptance tests.
2. **ROLES_PERMISSIONS.md:** Full per-action matrix and approval policies.
3. **DATABASE_DESIGN.md:** ERD, indices, uniqueness, organization scoping and migration plan.
4. **API_SPECIFICATION.md:** Authenticated contract, error semantics, idempotency and pagination.
5. **DESIGN_SYSTEM.md:** Responsive owner/manager UX, tenant PWA screen flows and interaction states.

See `ROADMAP.md` for the version plan and `DECISIONS.md` for unresolved business rules with suggested defaults.
