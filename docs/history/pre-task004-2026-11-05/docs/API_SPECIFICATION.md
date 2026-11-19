# Provisional API contract outline

Status: PROVISIONAL, 2026-11-05. Resource names/routes/payload conventions are proposals, not implemented endpoints or approved business policies. Sources: [SRS](SRS.md), [permissions](ROLES_PERMISSIONS.md), [database design](DATABASE_DESIGN.md) and [open questions](OPEN_QUESTIONS.md).

## Contract boundary

Use shared TypeScript module services behind Next.js route handlers/server actions. Internal UI calls do not need a separate HTTP round trip, but must enforce the same validation, authorization, idempotency and transaction semantics. Suggested HTTP prefix: `/api/v1`. No provider/authentication library is selected; O-014/GAP-011 must settle authentication details.

Organization resource base in this outline is `/api/v1/organizations/{organizationId}` (abbreviated ORG below). The path parameter selects context; it is never trusted authorization. Authenticate on every private request, resolve active membership server-side and check action/plaza/resource access. Tenant routes also require explicit representative grants. Background tasks and file/export downloads follow identical scope rules. Routine Platform Admin access to customer financial routes is prohibited.

## Major resources and workflows

| Proposed resource/action | Methods / purpose | Actors and linked requirements | Policy gate |
|---|---|---|---|
| `/auth/session`, sign-in/out/recovery workflows | Provider-dependent; session read/revoke | All users; AUTH-001 | O-014; do not assume email/password is approved |
| `/platform/organizations` | POST provision; GET metadata | Platform Admin; PLZ-001 | O-012 lifecycle; no financial payload |
| `ORG` | GET permitted org summary | Active members; AUTH-002 | O-012/O-018 |
| `ORG/invitations`, `memberships/{id}/deactivate` | POST invite/deactivate; invitation acceptance workflow | Owner / recipient; AUTH-004 | O-014, GAP-009 |
| `ORG/plazas`, `/plazas/{id}`, `/sections`, `/units` | GET lists/details; POST create; PATCH permitted nonhistorical fields | Scoped Owner/Manager, scoped readers; PLZ-001–PLZ-002 | GAP-005 |
| `ORG/shop-tenants`, `/shop-tenants/{id}` | GET/POST/PATCH profile | Staff per matrix; TEN-001 | O-001/O-016/O-018 |
| `ORG/representatives`, `/resource-grants` | Proposed invite/grant/revoke actions | Actors provisional; AUTH-002, TEN-001 | GAP-006; no grant routes finalized |
| `ORG/leases`, `/leases/{id}` | GET/POST; historical terms read | Owner/Manager writes, scoped readers; LSE-001 | O-001–O-004 |
| `ORG/leases/{id}/renew`, `/terminate` | POST reasoned, effective-dated action | Owner/Manager; LSE-002 | O-003/O-004, GAP-005 |
| `ORG/charge-types`, `/charge-rules` | GET/POST/PATCH eligible rules | Billing staff; BIL-002 | O-006/O-015/O-017 |
| `ORG/billing/previews` | POST validate/generate preview | Billing staff; BIL-001–BIL-002 | O-003–O-006, GAP-008 |
| `ORG/invoices`, `/invoices/{id}` | GET; POST draft; PATCH draft only | Billing staff, own-tenant issued read; BIL-001–BIL-003 | O-010/O-015/O-017 |
| `ORG/invoices/{id}/issue`, `/corrections` | POST explicit idempotent transition | Authorized billing/approval roles; BIL-003 | O-015, GAP-004; no generic issued-amount PATCH |
| `ORG/payment-claims` | POST pending assertion; GET scoped claims | Staff / own Tenant; PAY-001 | O-007, GAP-003 |
| `ORG/payment-claims/{id}/verify`, `/reject` | POST review decision | Owner/Accountant per final approval policy; PAY-002 | O-008; edit/cancel not assumed |
| `ORG/payments`, `/payments/{id}` | GET verified funds and authorized balance projection | Scoped staff / own Tenant; PAY-003 | GAP-003 |
| `ORG/payments/{id}/allocations` | POST eligible invoice allocations | Owner/Accountant provisional; PAY-003 | O-009, GAP-003/GAP-004 |
| `ORG/payments/{id}/reversals` | POST reasoned correction | Final approver roles; PAY-004 | O-008/O-009, GAP-004; no implied refund endpoint |
| `ORG/receipts/{id}`, `/receipts/{id}/download` | GET current status / authorized PDF | Permitted staff / own Tenant; PAY-003, PWA-002 | O-010; verified funds only |
| `ORG/expenses`, `/expenses/{id}/corrections` | GET/POST expense; POST correction | Owner/Manager/Accountant as approved; EXP-001 | O-015, GAP-002 |
| `ORG/reports/{overview,receivables,payments,expenses,occupancy}` | GET scoped filters/cutoff | Permitted staff; RPT-001–RPT-002 | GAP-002/GAP-003/GAP-005 |
| `ORG/imports`, `/imports/{id}/preview`, `/imports/{id}/commit` | POST upload/validate/commit; GET status/errors | Import-authorized staff; IMP-001 | GAP-001/GAP-009 |
| `ORG/exports`, `/exports/{id}`, `/exports/{id}/download` | POST request; GET status/private download | Authorized scoped readers; IMP-001/RPT-002 | O-012/O-013, GAP-002 |
| `ORG/files`, `/files/{id}/download` | POST upload intent/content; GET authorized stream | Parent-resource and attachment-class permission; OPS-002 | O-013/O-016, GAP-009 |
| `ORG/audit-events` | GET scoped safe events | Owner, limited Manager/Accountant; AUD-001 | O-013, GAP-010 |
| `ORG/portal/{shops,bills,payments,lease-summary}` | GET explicit own-resource projections | Tenant; PWA-001–PWA-002 | O-016, GAP-006 |
| `ORG/portal/contact-change-requests` | Optional POST/GET request | Tenant; PWA-005 | GAP-012; P1 only |

Resource ownership is always resolved from stored relationships. Do not accept arbitrary combinations of invoice, tenant, lease and organization IDs merely because each exists. Cross-plaza payment, consolidated invoice and representative-grant payloads remain BLOCKED until the relevant relationship policies are approved.

## Proposed common contracts

- IDs are opaque strings. Lists use bounded cursor pagination with stable ordering; page-size maximum is PROVISIONAL. Search/filter fields are allowlisted. Do not expose total counts from unauthorized rows.
- Money example representation: `currency: NGN`, `amountKobo: "7500000"` for NGN 75,000. Use integer decimal strings; reject unsafe fractional/overflow input. Final limits await the database specification review.
- Instants use ISO 8601 UTC timestamps; business dates use `YYYY-MM-DD` and are interpreted in Africa/Lagos. Due-date and report recognition policies remain blocked rather than guessed.
- Proposed response metadata: request ID, selected scope and, for reports, filters, timezone, date basis, cutoff and generation time. Scope metadata is descriptive, not an authorization token.
- Mutation requests carry version/concurrency token where stale edits matter. Issue, verify, allocate, reverse and import commit use an idempotency key scoped to organization and operation, bound to a request fingerprint. Same key/same operation returns the stored result; changed payload conflicts. Retention/retry window is a technical value to specify before implementation.
- Do not accept client-controlled verification status, verifier ID, receipt number or derived balance. The server establishes these from authorized transitions.
- File input includes only approved content metadata and an authorized parent; size/type/content checks occur server-side. Download responses stream authorized content or use a reviewed short-lived mechanism. Public object keys/URLs are not API permissions.
- Private financial/session responses use `Cache-Control: private, no-store` and bypass shared/server/service-worker caching by default. Clear private client state at logout/context change. Public shell assets may be cached separately.
- Cookie-based mutations require CSRF protection and origin checks; validate content types, rate-limit sensitive endpoints and never log credentials or full payment evidence. These controls apply equally to server actions.

## Proposed response/error semantics

| Outcome | Proposed HTTP status / machine-readable meaning |
|---|---|
| Read success | 200 |
| Resource created | 201 |
| Accepted asynchronous job | 202 with authorized job reference; not a claim that work completed |
| Successful action with no body | 204 |
| Malformed request | 400, `INVALID_REQUEST` |
| Missing/expired authentication | 401, `AUTHENTICATION_REQUIRED` |
| Forbidden permitted-context action | 403, `ACTION_FORBIDDEN` |
| Missing or inaccessible object | 404, `RESOURCE_NOT_FOUND`; consistent response avoids cross-org existence leaks |
| Invalid transition/stale version/idempotency mismatch | 409, specific non-sensitive conflict code |
| Field/business validation | 422, field errors without foreign-resource disclosure |
| Too large / unsupported upload | 413 / 415 |
| Rate limit | 429 with retry guidance |
| Unexpected failure | 500 with request ID, no database/secret details |

Suggested error envelope: code, safe message, optional field errors and request ID. A blocked business policy is a specification gate, not an invented production rule or an endpoint that silently chooses a default.

## Workflow guarantees

1. Billing preview does not issue obligations. Issue revalidates source version and authorization; a changed preview yields a conflict rather than silent new terms.
2. Claim submission returns pending review, not payment confirmation. Verify/reject is a separate authorized action; exactly one VerifiedPayment may result from a claim.
3. Allocation checks available funds and outstanding debt in one transaction. Concurrent/retried requests cannot overspend either.
4. Correction responses preserve original references and current effect. Exact void/refund/partial reversal payloads are BLOCKED under GAP-004/O-009.
5. Import preview returns counts and row/field errors with no operational writes. Commit requires explicit action and revalidation; atomicity/duplicate merge policy awaits GAP-009.
6. Export jobs capture the agreed filter/cutoff semantics; execution and download recheck authority. Private artifacts expire under the future retention policy.

Future contract tests must cover forged organization IDs, role/plaza/representative denial, idempotency replay and mismatch, verify/reject races, stale preview, denied private files, export after revocation and exact decimal-string money round trips. No endpoints or executable tests are created in Task 002.
