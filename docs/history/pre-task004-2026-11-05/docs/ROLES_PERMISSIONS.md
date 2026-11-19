# Roles and permissions

Status: DRAFT / PROVISIONAL, 2026-11-05. Source: [PRD sections 3, 6 and 7](PRD.md), [DECISIONS](DECISIONS.md) and [open questions](OPEN_QUESTIONS.md). This matrix elaborates the PRD; it does not approve O-008, O-015 or other open policies.

## Principals and scope

Platform Admin is the PRD Platform Operator / SaaS Super Admin. Organization Owner is Owner; Plaza Manager is Manager; Tenant means an authenticated, explicitly authorized representative of a shop tenant, not a customer organization.

Every request requires an active authenticated user and, for customer data, an active organization membership, a permitted action, permitted plaza scope and a relationship to the requested resource. Organization IDs and role names supplied by clients are selectors, never proof of access. Apply the same checks to pages, APIs, server actions, background jobs, search, reports, exports and attachments.

An organization owner has access only within their granted organization/scope, not all customer organizations. A plaza assignment cannot grant access to another organization. Tenant access requires an explicit representative grant; matching an email, phone number or business name is insufficient. Multi-role grants must remain tied to their respective scopes; do not combine a role in Plaza A with a different grant in Plaza B. Exact role-combination policy is PROVISIONAL; deny ambiguous grants until specified.

## Matrix

Legend: **R** read; **C/U** create/update non-issued records; **X** perform action; **OWN** explicitly linked tenant resources only; **S** permitted organization/plaza scope; **P** provisional permission requiring the listed decision; **—** deny. Unlisted actions deny by default. Every permission is constrained by scope, not a global grant.

| Resource/action | Platform Admin | Organization Owner | Plaza Manager | Accountant | Tenant | Policy dependency |
|---|---|---|---|---|---|---|
| Provision organization | X, metadata only | — | — | — | — | PRD PLZ-001 |
| Organization status/support metadata | R/U metadata only | R S | — | — | — | Suspension effects O-012 |
| Maintain plazas, floors, units | Support metadata R only | C/U/R S | C/U/R S | R S | R OWN summary | PRD PLZ-001–PLZ-002 |
| Invite/deactivate staff | Provisioning support only | X S | — | — | — | AUTH-004; no role grants beyond actor authority |
| Tenant profiles | — | C/U/R S | C/U/R S | R S | R OWN approved projection | O-016, O-018 |
| Invite/remove tenant representatives | — | P S | P S | — | — | GAP-006, O-014, O-018 |
| Create/renew/terminate leases | — | X/R S | X/R S | R S | R OWN summary | O-001–O-004, O-016 |
| Prepare billing/charge drafts | — | C/U/R S | C/U/R S | C/U/R S | — | O-003–O-006, O-017 |
| Issue invoices | — | X S, approval P | X S, approval P | X S, approval P | — | PRD permits role; O-015 defines approval |
| Read issued invoices | — | R S | R S | R S | R OWN | O-016, GAP-008 |
| Void/correct issued invoice | — | P S | — pending policy | P S | — | O-015, GAP-004 |
| Record transfer claim | — | C/R S | C/R S | C/R S | C/R OWN | O-007; submitted edit/cancel blocked |
| Verify/reject claim | — | P S | — | P S | — | O-008; independent external bank check |
| Allocate verified payment | — | P S | — | P S | — | O-009, GAP-003–GAP-004 |
| Reverse verified payment/allocation | — | P S | — | P S | — | O-008, O-009, GAP-004 |
| View verified payments/receipts | — | R S | R S | R S | R OWN | GAP-003 controls shared payment projection |
| Create/download receipt | — | X/R S | R S | X/R S | R OWN | Verified funds only; O-010 |
| Record/read expense | — | C/R S | C/R S | C/R S | — | EXP-001 |
| Correct expense | — | P S | P S | P S | — | O-015; audit mandatory |
| Owner/operational reports | — | R S | R S | R S | Own bills/payments only | RPT-001–RPT-002 |
| CSV exports | — | X S | X S | X S | OWN records only, format P | Same fields/scope as read; no tenant bulk plaza export |
| Import units/tenants/leases | — | P S | P S | — | — | Derived proposal; GAP-009 review of import authority |
| Download private file | — | R S if parent allowed | R S if parent allowed | R S if parent allowed | R OWN if attachment class allowed | O-016; parent access alone cannot override confidentiality |
| Audit history | Metadata only | R S | Limited R S | Finance-event R S | — | Field/event projection P; no secrets/evidence payloads |
| Request contact update (P1) | — | — | — | — | P OWN | PWA-005, GAP-012 |
| Approve contact update (P1) | — | P S | P S | — | — | GAP-012 |

## Financial approvals and platform access

- Pending claims cannot be approved by tenants or managers. Accountant/owner capability is stated by the PRD, but the exact maker/checker restrictions, exceptions and reversal approval process are BLOCKED on O-008. Do not implement an automatic self-approval exception.
- Allocation, refunds and corrections remain BLOCKED on O-009 and GAP-004. A permission to record a claim is never permission to verify it.
- Routine Platform Admin access to customer invoices, payments, expenses, leases, private attachments, report data or financial audit payloads is explicitly prohibited. Provisioning privileges are not a bypass.
- Exceptional customer-data support access requires explicit authorization, narrow resource/action scope, expiry, revocation and audit. The exact approver/process is BLOCKED on GAP-010; disable this path until settled. Never silently impersonate a customer.
- Deactivation/revocation must take effect on subsequent server requests and job execution. Existing financial audit actors remain attributable. Recheck permissions when an export is downloaded, not only when it is requested.

## Required authorization checks

Use at least two organizations, two plazas per organization and two shop tenants in tests. Deny guessed foreign IDs, modified organization/plaza selectors, unauthorized role escalation, inactive memberships and missing representative grants. Test aggregate reports, export artifacts, private file downloads and jobs as well as ordinary CRUD. Verify that one user with separate memberships cannot merge contexts. Test that revoking a representative prevents future access while preserving historical financial records. Detailed test cases trace to AUTH-001–AUTH-004, AUD-001 and OPS-002 in [SRS](SRS.md).
