# Roles and permissions

Status: updated 2026-11-05 for [owner-delegated SELECTED WORKING DEFAULTS](DECISIONS.md#current-selected-working-defaults), not both-founders sign-off or legal/privacy validation. Selected constraints below coexist with explicitly provisional action details. The [original matrix](history/pre-task004-2026-11-05/docs/ROLES_PERMISSIONS.md) is preserved; see [remaining questions](OPEN_QUESTIONS.md). No business workflow is implemented by this specification.

## Principals and scope

Platform Admin is the PRD Platform Operator / SaaS Super Admin. Organization Owner is Owner; Plaza Manager is Manager; Tenant means an authenticated, explicitly authorized representative of a shop tenant, not a customer organization.

Every request requires an active authenticated user and, for customer data, an active organization membership, a permitted action, permitted plaza scope and a relationship to the requested resource. Organization IDs and role names supplied by clients are selectors, never proof of access. Apply the same checks to pages, APIs, server actions, background jobs, search, reports, exports and attachments.

An organization owner has access only within their granted organization/scope, not all customer organizations. A plaza assignment cannot grant access to another organization. Tenant access requires an explicit representative grant; matching an email, phone number or business name is insufficient. Multi-role grants must remain tied to their respective scopes; do not combine a role in Plaza A with a different grant in Plaza B. Exact role-combination policy is PROVISIONAL; deny ambiguous grants until specified.

O-014 selects staff email/password plus MFA and tenant phone OTP with optional email/secure recovery. Role membership alone cannot turn a tenant OTP session into staff-assured access; staff access must satisfy staff authentication requirements. Provider/factor/step-up/recovery design remains open. O-018 permits shared identity, not shared business records. GAP-006 selects explicit per-resource grants and no out-of-scope receipt disclosure. O-012 selects a 30-day read/export grace after subscription expiry followed by restricted staff operations; exact write/post-grace/tenant allowlists remain unresolved and must not be inferred from this ordinary active-organization matrix.

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
| Record transfer claim | — | C/R S | C/R S | C/R S | C/R OWN | O-007: immutable after submission; cancellation/rejection + resubmission for correction |
| Verify claim | — | X S, never self-submitted | — | X S, never self-submitted | — | O-008 selected; external bank check, current authority and PostgreSQL transition protection |
| Reject/cancel claim | — | P S | — pending action policy | P S | P OWN cancellation only, policy pending | O-007 selected path; exact actors/states unresolved; no direct edit |
| Allocate verified payment | — | P S | — | P S | — | O-009, GAP-003–GAP-004 |
| Reverse verified payment/allocation | — | P S | — | P S | — | O-008, O-009, GAP-004 |
| View verified payments/receipts | — | R S | R S | R S | R OWN authorized projection | GAP-003 one-plaza payment; GAP-006 prevents out-of-scope disclosure |
| Create/download receipt | — | X/R S | R S | X/R S | R OWN only if all disclosed records authorized | O-010 selected PDF/per-org reference; full-artifact scope check mandatory |
| Record/read expense | — | C/R S | C/R S | C/R S | — | EXP-001 |
| Correct expense | — | P S | P S | P S | — | O-015; audit mandatory |
| Owner/operational reports | — | R S | R S | R S | Own bills/payments only | RPT-001–RPT-002 |
| CSV exports | — | X S | X S | X S | OWN records only, format P | Same fields/scope as read; no tenant bulk plaza export |
| Import units/tenants/leases and opening arrears/credits | — | P S | P S | — pending import-role policy | — | GAP-001 scope selected; import roles/commit/sign-off remain provisional GAP-009 |
| Download private file | — | R S if parent allowed | R S if parent allowed | R S if parent allowed | R OWN if attachment class allowed | O-016; parent access alone cannot override confidentiality |
| Audit history | Metadata only | R S | Limited R S | Finance-event R S | — | Field/event projection P; no secrets/evidence payloads |
| Request contact update (P1) | — | — | — | — | P OWN | PWA-005, GAP-012 |
| Approve contact update (P1) | — | P S | P S | — | — | GAP-012 |

## Financial approvals and platform access

- Only authorized Owners/Accountants verify payments. Staff cannot self-approve submitted transactions (O-008 SELECTED WORKING DEFAULT), including someone who changes active role but remains the same submitting identity. No sole-owner/self-approval fallback is selected. Lack of an eligible independent approver keeps approval blocked.
- Sensitive adjustments, reversals and refunds require approval gates (O-015 selected). Exact request/approve/execute roles, thresholds and sensitive-action definitions remain open. The workshop's “another Owner for every correction” recommendation is not implicitly selected; keep those actions provisional. A permission to record a claim is never permission to verify it. Refund approval requirements do not authorize implementing a refund workflow in Task 004.
- Visible auditable unapplied funds and one-plaza payment ownership are selected. Allocation/correction mechanics remain blocked on O-009/GAP-004. Source-of-funds and bank-event duplicate review must not be replaced by claim uniqueness alone.
- Routine Platform Admin access to customer invoices, payments, expenses, leases, private attachments, report data or financial audit payloads is explicitly prohibited. Provisioning privileges are not a bypass.
- Exceptional customer-data support access requires explicit authorization, narrow resource/action scope, expiry, revocation and audit. The exact approver/process is BLOCKED on GAP-010; disable this path until settled. Never silently impersonate a customer.
- Deactivation/revocation must take effect on subsequent server requests and job execution. Existing financial audit actors remain attributable. Recheck permissions when an export is downloaded, not only when it is requested.

## Required authorization checks

Use at least two organizations, two plazas per organization and two shop tenants in tests. Deny guessed foreign IDs, modified organization/plaza selectors, unauthorized role escalation, inactive memberships and missing representative grants. Test aggregate reports, export artifacts, private file downloads and jobs as well as ordinary CRUD. Verify that one user with separate memberships cannot merge contexts. Test that revoking a representative prevents future access while preserving historical financial records. Detailed test cases trace to AUTH-001–AUTH-004, AUD-001 and OPS-002 in [SRS](SRS.md).

Selected-rule acceptance additions: reject staff self-approval even after role switching; reject staff access lacking staff MFA assurance; deny a full payment PDF if any disclosed financial record is outside a representative's grants; deny allocation to another plaza. Test expiry grace and after-grace transitions only after exact boundary/action rules are specified, without treating the 30-day grace as file-retention authorization.
