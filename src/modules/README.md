# Module boundaries

This is one modular monolith. No domain services, data models or endpoints are implemented in Task 004. Add a module's directory when it gains authorized implementation; do not add empty service classes, fake repositories or placeholder CRUD handlers.

Task 005 adds `identity/`: Better Auth configuration, centralized authorization, scoped membership services and identity HTTP/page boundaries. Its organization identity operations use the supported plugin's Member/Organization models; no competing membership repository exists. Other business modules below remain unimplemented. `/staff` and `/platform` now enforce server-side authorization; public previews moved to `/preview/staff` and `/preview/platform`. The historical Task 004 statements below describe the earlier foundation, not current identity coverage. See `docs/TASK005_STATUS.md` for verification limits.

| Future path under src/modules/ | Responsibility | Primary dependencies |
|---|---|---|
| identity/ | Authentication/session assurance and recovery | Reviewed MFA/OTP/provider design |
| organizations/ | Organization contexts and scoped grants | identity; final grant/lifecycle policy |
| property/ | Plaza/unit registry and independent availability | organizations |
| leasing/ | Tenant representation, contracting parties, historical leases | organizations/property; date policy |
| billing/ | Obligations, immutable issuance and adjustments | leasing; approved scheduling/correction rules |
| payments/ | Claims, verified funds, allocations and receipts | billing; independent verification/approval rules |
| expenses/ | Recorded expenses and corrections | organizations/property; approvals |
| reporting/ | Reconciled, scoped read projections | Authoritative module query interfaces |
| imports/ | Validated staged import and opening entries | Respective modules; approved migration policies |
| files/ | Private asset handling and resource-authorized delivery | organizations/identity; approved storage/retention |
| audit/ | Attributable transactional audit events | Explicit actor/context; no secrets/evidence payloads |

Routes and UI call application services. Modules validate all trust-boundary inputs and receive an explicit authenticated scope when authorization is implemented later. No module may infer authority from a client organization ID. Domain services own their writes; cross-module workflows have one explicit transaction owner. Critical finance must use PostgreSQL transactional/concurrency controls. Private caching, role decisions and business policy must not be hidden in UI helpers.

Infrastructure is in src/lib/db; shadcn primitives are in src/components/ui; public shells are in src/app and src/components. Route groups separate layout composition only: they are NOT authorization boundaries. There are no protected/private routes yet. Review docs/OPEN_QUESTIONS.md and the selected decisions before implementing any domain module.
