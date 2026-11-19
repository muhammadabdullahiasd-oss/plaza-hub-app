# Canonical PlazaHub documentation

Established: 2026-11-05, Task 002. This directory is authoritative for ongoing documentation. Canonical location does not imply founder approval of draft content.

## Reading order

| Document | Purpose / status |
|---|---|
| [PRD.md](PRD.md) | Original v1.0 requirements, revision 0.1; preserved verbatim |
| [ROADMAP.md](ROADMAP.md) | Original release boundaries; preserved verbatim |
| [DECISIONS.md](DECISIONS.md) | D-001–D-009 working decisions and O-001–O-018 open decisions; preserved verbatim |
| [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) | Existing decisions and newly identified gaps, with implementation gates |
| [SRS.md](SRS.md) | Detailed requirement records and acceptance scenarios; draft |
| [ROLES_PERMISSIONS.md](ROLES_PERMISSIONS.md) | Scoped action matrix and provisional approvals; draft |
| [DATABASE_DESIGN.md](DATABASE_DESIGN.md) | Conceptual model and integrity boundaries; not a final schema |
| [API_SPECIFICATION.md](API_SPECIFICATION.md) | Provisional resources, workflows and contract conventions |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Proposed staff and tenant interaction/design foundation |

## Provenance and precedence

The root and PlazaHub_Product_Plan/docs/ versions of each source document had matching SHA-256 digests. Root copies were copied without rewriting content into this directory. Original files remain in place.

| File | SHA-256 of source and canonical copy at consolidation |
|---|---|
| PRD.md | C9580BDD20A4BA5E3F6957F5D10811EFDAEA4300C12E023E4D75FA7DE21A251F |
| ROADMAP.md | B092EBD68D282C401A0C6CE1B75E5BC2776641D4E6CEBC13FAB94C11FBA8F8FE |
| DECISIONS.md | B463861696133C89EEB702B45020F056E253B57DB021FC49F6DA31FDAE4448D5 |

Task 001 assessment was available in conversation, not as a repository file. Its additional questions are captured under the distinct GAP namespace in OPEN_QUESTIONS.md. Two root PNG reference artifacts are retained; Task 002 does not establish them as approved visual specifications.

The user-approved stack includes Tailwind CSS and shadcn/ui in addition to D-003. Detailed specifications elaborate the PRD; they do not override its scope or resolve open decisions. Where the source PRD describes behavior whose policy remains open in DECISIONS, preserve that requirement and mark the affected implementation BLOCKED or PROVISIONAL. Raise contradictions instead of silently choosing a policy.

SRS status terminology: BASELINE means traceable to the PRD, not new approval; PROVISIONAL means a proposal requiring review; BLOCKED means the named policy-dependent part cannot be finalized or implemented until a decision is recorded. Blocking a policy does not invalidate shared security/integrity requirements.

Record founder answers in DECISIONS.md with date, owner, scope and affected requirements, then update this specification set. Preserve all existing IDs. GAP identifiers are questions, not approved decisions. PRD references to next specifications are retained historical source text; the draft files now exist here.
