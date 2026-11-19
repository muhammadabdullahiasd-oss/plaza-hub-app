# Design system and interaction foundation

Status: DRAFT / PROVISIONAL, 2026-11-05. This is a proposed design foundation, not approved branding or implemented components. Sources: [PRD](PRD.md), [SRS](SRS.md), [permissions](ROLES_PERMISSIONS.md) and [open questions](OPEN_QUESTIONS.md). Use Tailwind CSS and shadcn/ui within the approved Next.js/TypeScript stack. No packages or components are created by this document.

## Product surfaces and navigation

Staff navigation: Overview; Plazas → Sections/Units; Shop tenants and leases; Billing → Invoices/Service charges/Receivables; Payments → Pending review/Verified/Receipts/Corrections; Expenses; Reports; Imports/Exports; Staff/Settings; Audit. Show only permitted navigation, while retaining server checks on direct routes. Platform provisioning is a separate restricted surface with customer metadata only, not a financial impersonation dashboard.

Keep active organization visible in the header. Scope selectors must clearly distinguish organization, plaza and reporting period. Switching organization clears prior private views, selected resources and pending form context; it must not merge data or submit a form into a different organization.

Tenant navigation: Home, Bills, Payments, My shop, Account. Use a persistent, labeled mobile navigation pattern and an explicit shop selector for multiple grants. Home shows current outstanding amount, relevant due date and distinct claim/payment statuses. Bills show itemized amounts, periods and due dates. Payments supports pending claim submission and verified receipt access. My shop shows only approved lease summary fields (O-016); Account includes sign-out and support information. Representative visibility and former-tenant access remain blocked on GAP-006.

## Responsive layout proposal

| Viewport | Staff surface | Tenant surface |
|---|---|---|
| 360–639px | Single-column tasks, navigation drawer, filters in accessible sheet, key metrics stacked | Primary design target; readable bills/cards, full-width primary action, no horizontal page scroll |
| 640–1023px | Compact navigation, two-column summaries where content permits | Wider single-column content or paired cards; preserve reading order |
| 1024px+ | Persistent sidebar, scoped toolbar, summary cards plus drill-down tables | Centered readable content; no requirement to mimic a desktop dashboard |

These breakpoints are design proposals, not device guarantees. Test 360–430px layouts, enlarged text and long Nigerian names/business names. Staff tables may use a labeled scroll container where necessary; tenant primary tasks must not require horizontal scrolling. Hide no critical financial value solely to fit a layout. Use tabular numerals and right-aligned monetary columns.

## Basic token proposals

| Token family | Initial values / intent |
|---|---|
| Background / surface | `#F8FAFC` page; `#FFFFFF` panels |
| Text | `#0F172A` primary; `#475569` secondary |
| Primary action / link | `#1D4ED8` with white text for filled action; underline text links when needed |
| Border | `#CBD5E1`; do not rely on a light border alone to identify interactive controls |
| Success | `#166534` text on `#F0FDF4`, plus explicit status text/icon |
| Warning / pending | `#92400E` text on `#FFFBEB`, plus label |
| Danger / overdue | `#B91C1C` text on `#FEF2F2`, plus label |
| Focus | Visible 2px high-contrast ring and offset; validate against surrounding surface |
| Typography | System sans-serif; 16px default body, approximately 1.5 line height; clear 20/24/32px heading scale |
| Spacing | 4px base; 4/8/12/16/24/32/48px scale |
| Corners | 8px controls, 12px cards; modest elevation only where hierarchy needs it |
| Touch | Proposed minimum 44×44px touch target for primary mobile controls |
| Content width | Tenant reading area approximately 40rem maximum; staff width adapts to table/task needs |

Map these to semantic CSS/Tailwind tokens, not hardcoded per-screen colors. Validate contrast for each actual foreground/background/state combination before implementation acceptance; no contrast testing has been performed in Task 002. Branding, logo and dark mode are not approved requirements. The two root PNG files remain unmodified references and have not been adopted as authoritative design specifications.

## Component and content rules

- Use accessible shadcn/ui primitives as a starting point, then verify actual keyboard behavior, labels and focus. Library choice is not evidence of accessibility compliance.
- Consistent components: scoped page header; metric with drill-down; filter toolbar; data table/list; empty/loading/error/offline states; currency/date input; status badge; evidence upload; confirmation dialog; receipt detail; audit timeline.
- Currency is labeled NGN or ₦ consistently with grouped digits and two decimal places where required. Render exact amounts from safe money values, never floating-point calculations. Do not confuse claim amount with verified collected funds.
- Distinguish Outstanding, Overdue, Invoiced, Verified collections, Unapplied funds and Recorded expenses. Do not label their difference as profit or all inflows as revenue.
- Show invoice issuance, settlement and overdue state without losing combinations such as Partially paid + Overdue. Show Pending claim as “Awaiting verification”; evidence upload must never produce “Payment successful.”
- Financial action previews show affected account, invoice/period, amount, resulting balance if calculable, and action consequences. Require reason where the approved correction workflow requires it. Approver controls remain provisional under O-008/O-015, not hardcoded from mockups.
- Forms have persistent labels, inline field errors and an error summary on submission. Preserve safe input on validation failure. Show pending submission state and recover uncertain outcomes by checking server status; disabling a button alone is not idempotency.
- File selection states include uploading, failed, pending validation and attached. Display allowed type/size only after limits are agreed under GAP-009. Do not expose private object URLs in UI or logs.
- Tables and report exports display the selected period/cutoff/timezone and metric date basis. Report terminology remains blocked on GAP-002 where recognition rules are unresolved.

## Accessibility acceptance

Aim for WCAG 2.2 AA as specified by the PRD; record exceptions rather than claiming unverified compliance. Verify logical headings, landmark/navigation labels, keyboard operation, visible focus, dialog focus management/return, form labels and error announcements. Never communicate status by color alone. Support zoom/reflow and readable long values without hiding amounts. Honor reduced-motion preferences and avoid unnecessary animations. Announce background completion/errors without unexpectedly moving focus.

Future checks: keyboard-only owner/accountant/tenant journeys; screen-reader form/status review; contrast verification; enlarged text; mobile touch targets; no horizontal overflow for tenant core tasks at 360px; receipt content readable and accessible in the portal even when a PDF is provided. PDF output should be evaluated for accessibility during implementation.

## Installability and offline behavior

The tenant portal is fully usable in a normal browser. Provide a valid manifest, icons, HTTPS and service worker for browser-supported installation. Installation affordances are optional and contextual; provide platform-appropriate instructions only where supported. Test on representative Android Chrome and iPhone Safari and record device/browser versions at implementation time. Do not promise a universal automatic install prompt.

**Private financial responses must not be cached by default.** Cache only public shell assets. Apply private/no-store behavior to private API/HTML responses and bypass CDN/server shared caches as well as service-worker caches. Do not store balances, bills, receipts, evidence or authentication data in IndexedDB/localStorage as an offline convenience. Session handling must use the approved secure authentication design.

When disconnected, show a clear “Offline — current balances unavailable” state and retain access to the non-sensitive shell. Do not display an old balance as current. Do not queue financial writes for automatic replay. If connection fails after submit, say the outcome is unconfirmed and reconcile using the operation reference when online. Reauthentication may be required before checking status.

On logout, membership change or organization switch, clear private in-memory content and ensure back navigation/service-worker updates do not reveal the former account. Reconnect refreshes from the authenticated source, not a stale snapshot. Test offline launch, interrupted claim upload, expired session, logout/back navigation and account switching on shared devices.

## Design gates

O-014 determines login/invitation UX; O-016 and GAP-006 determine tenant-visible summaries; O-007–O-010/O-015 determine claim/approval/correction actions; GAP-002/GAP-003 determine reporting labels and scope. Do not draw a working-looking approval flow that silently settles these policies. Further screen-level wireframes and founder design review are a subsequent task.
