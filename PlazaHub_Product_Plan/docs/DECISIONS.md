# PlazaHub — Decisions, Assumptions and Open Business Rules

> **Document revision:** 0.1 | **Prepared:** 2026-11-05  
> Purpose: preserve explicit defaults so two founders can proceed without treating unverified assumptions as settled policy.

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
