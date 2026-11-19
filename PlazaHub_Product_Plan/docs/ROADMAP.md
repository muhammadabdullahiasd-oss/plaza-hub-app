# PlazaHub — Product Version Roadmap

> **Document revision:** 0.1 | **Prepared:** 2026-11-05  
> Roadmap order is intentional; dates are not committed. Features may move based on pilot operations and customer evidence.

## Release strategy

Build a narrow, correct commercial-plaza finance platform first; expand only after data and workflows are trustworthy. Each release should preserve existing financial history, access controls and tenant PWA compatibility.

| Version | Theme | In scope | Explicitly not required | Exit signal |
|---|---|---|---|---|
| **v0.1** | Validation / planning *(parallel workstream; deferred by founders)* | Interviews, prototype review, price hypotheses, pilot discovery | Complete production software | Documented evidence and target segment (when founders choose to perform it) |
| **v0.2–v0.9** | Internal alpha/beta for v1.0 | Build and test v1.0 capabilities incrementally | Public self-service launch | Automated tests, staging rehearsals, reconciliation |
| **v1.0** | Commercial-plaza MVP | Organizations/plazas/units, leases, rent/service-charge invoices, partial payments, verified manual transfers, receipts, expenses, owner reporting, basic imports, tenant PWA, security/audit | Payment gateway, maintenance ticketing, push, subscription checkout | PRD acceptance criteria passed; pilot-ready |
| **v1.1** | Operational workflows | Maintenance tickets, document improvements, rent due reminders by appropriate channels, richer reports, bulk actions, improved tenant support | Smart meters, native apps | Support burden manageable; operational tasks complete end-to-end |
| **v1.5** | Payment automation | Paystack integration, verified webhook events, automatic reconciliation, payment links, refined credit handling, configurable charge allocation | Full ERP/accounting product | Gateway event reconciliation and failure scenarios pass |
| **v2.0** | SaaS growth | Self-service organization onboarding, subscription billing, account limits, multi-plaza portfolio controls, advanced permissions, support tooling, customer configuration | AI/IoT by default | Repeatable onboarding and reliable paid subscription lifecycle |
| **v3.0** | Advanced intelligence / ecosystem | Optional meter integrations, analytics/forecasting, vendor/maintenance intelligence, accounting integrations and enterprise capabilities | Guaranteed feature set without demand evidence | Each advanced capability has documented customer value and maintainable economics |

## v1.0 development workstreams

### Foundation / platform
- Auth sessions, secure invitations, org membership, plaza assignment and permissions.
- Multi-organization database guardrails, private attachments, audit events and monitoring.
- Working staging/production environments, migration and backup/restore playbook.

### Registry / leasing
- Organization, plaza, floor/section and unit inventory.
- Shop tenant profiles and historical dated leases.
- Occupancy rules and lease overlap prevention.

### Billing / payments / expense
- Rent and fixed/manual service charges; invoice preview and issuing.
- Tenant transfer claims, staff verification, allocations and verified receipt generation.
- Partial payments, unallocated balance handling, reversible corrections, expense ledger.

### Reporting / portal / migration
- Owner KPIs, transaction drill-down, aged debt, expenses and CSV exports.
- Tenant PWA on mobile web, with optional home-screen installation, bills and receipts.
- Initial import templates and error reporting.

## Implementation sequence (dependencies, not calendar promises)

1. **Foundation** → authorization, customer-org scope, finance conventions.
2. **Property registry** → plazas, units, shop tenants, leases.
3. **Billing** → rent and service-charge invoice issuance.
4. **Payments** → pending/verified state, allocations, receipts and reversal.
5. **Reports** → collections and arrears reconciliation from authoritative transactions.
6. **Tenant PWA** → secure shop-scoped experience, installability and poor-connectivity handling.
7. **Pilot hardening** → CSV migration, cross-tenant testing, restore rehearsal and operational documentation.

The tenant UI can be wireframed earlier and developed in parallel after invoice/payment contracts are stable.

## Candidate post-v1.0 epics

### v1.1
- **MNT-100** Maintenance request lifecycle (tenant submits, staff triages, assigns and closes).
- **NOT-100** Reminder templates and notification preferences.
- **DOC-100** Improved controlled document delivery and reports.
- **BULK-100** Safe bulk billing/operations with preview and dry-run.

### v1.5
- **GW-100** Payment gateway integration with signature-verified webhook events.
- **GW-110** Idempotent matching and settlement reconciliation.
- **FIN-110** Advanced credit/refund controls and allocation rules.
- **BIL-110** More sophisticated common-area and usage-based charge calculations.

### v2.0
- **SAAS-100** Self-service customer sign-up and organization provision.
- **SAAS-110** Plans, subscriptions, trials and dunning.
- **ORG-110** Portfolio insights, delegated roles and configurable organizational controls.
- **SUP-100** Audited support workflows and customer data portability.

### v3.0
- **IOT-100** Smart/remote meter imports/integrations.
- **AI-100** Explanation/forecasting over authorized financial data.
- **INT-100** Accounting, messaging and vendor-service integrations.

## Release gating rules

- A new feature cannot weaken tenant isolation or financial reconciliation.
- Data migrations must preserve or explicitly transform historical references with verification.
- Payment gateway go-live requires server-side confirmation, signature validation, idempotency and failed-event replay testing.
- PWA compatibility must be regression-tested on representative Android and iPhone devices.
- Future versions should be reprioritized after measurable usage and support feedback, not fixed by this document alone.

## Change management

Use semantic release tags for actual deployments where possible, but track PRD revisions separately. A feature moving from v1.1 to v1.0 requires an explicit PRD scope update, acceptance criteria and developer sign-off. Record decisions in `DECISIONS.md` and implementation tickets in the issue tracker.
