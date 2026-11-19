# Task 004-C independent WebKit reproduction

## Task 004-D blocked environment and CI prerequisites

Discovery on 2026-11-13 found no Docker command, standard Docker Desktop/CLI installation, Docker service or Docker process. `wsl --status` and `wsl --list --verbose` both report WSL is not installed. Installed and locked Playwright version is **1.65.0**. Task 004-D stopped at its explicit environment gate; no Linux or Windows tests were run in that attempt, and no OS components were installed.

Recommended path preserving the no-publication restriction: use a founder-approved **private Linux CI runner** that accepts an approved source archive. Reuse the commands below and the verification sequence in `.github/workflows/ci.yml`; do not require a public repository. Before execution, founders must identify/approve the runner and authorize private source transfer, job execution, browser/system dependency installation within that disposable runner, any service cost and artifact retention. Do not upload secrets, `.env`, Windows node_modules, build output or unrelated files. Keep the original tests and genuine lockfile; record source and lockfile hashes. Install fresh Linux dependencies in an isolated workspace so Windows node_modules cannot be changed.

Runner prerequisites: supported Linux with Node **24.15.0**, pnpm **12.16.1**, package/browser download access and Playwright **1.65.0**. Install browsers through that locked package's `playwright install --with-deps chromium webkit`. If an official Playwright container is chosen instead, verify its exact published version matches **1.65.0** before use; no image availability or container run has been verified here. Headed Linux checks additionally need an approved Xvfb/display environment. No production secrets or live database are required.

Execute lint, typecheck, unit tests and build, then the unchanged focused WebKit assertion, minimal HTML diagnostic and complete browser suite. Preserve each result independently, including failures, OS/browser versions, before/after-Tab focus, activeElement, keyboard events, traces and screenshots. A Linux pass must not be described as proof of Windows accessibility.

The existing GitHub Actions workflow is an alternative only after separate founder authorization for private repository creation/source upload or push and workflow execution. Those actions remain prohibited by Task 004-D and were not performed. Installing local Docker/WSL2 also needs explicit system-level founder approval. No test change is proposed or applied at this blocked stage.

Source follow-up, recorded 2026-11-13: [WebKit TabsToLinks defaults](https://raw.githubusercontent.com/WebKit/WebKit/main/Source/WTF/Scripts/Preferences/UnifiedWebPreferences.yaml) differ between GTK/WPE and other platforms. [Alt+Tab inversion](https://raw.githubusercontent.com/WebKit/WebKit/main/Source/WebCore/page/EventHandler.cpp) is Cocoa-specific. These upstream sources corroborate the measured Windows behavior but do not prove the installed binary's effective settings. The inspected installed protocol/public APIs do not expose a TabsToLinks override. Prefer an independent Ubuntu comparison over forcing application focus or patching browser internals.

Prepared 2026-11-11. No remote, push, deployment or workflow execution is authorized by this document. The existing `.github/workflows/ci.yml` already provides an Ubuntu runner, pinned Node/pnpm, frozen installation, build, Chromium/WebKit installation with system dependencies, full tests and failure artifacts. It has not run for this task. Publishing this repository or dispatching a remote run requires founder authorization first.

## Local evidence

Windows 10.0.26100, Node 24.15.0, pnpm 12.16.1, Playwright 1.65.0, Chromium 158.0.8127.18, WebKit 27.2. The original test is `keyboard skip link focuses main content` in `tests/e2e/foundation.spec.ts`; it remains unchanged and enabled.

The instrumented comparison covers Chromium/WebKit, desktop/iPhone 13 contexts, application/minimal HTTP HTML and headless/headed modes: 16 combinations. Inspect `.cache/task004c/headless.json` and `headed.json` for timestamped focus, activeElement, visibility, trusted keyboard events, focus/blur events and console errors. These are diagnostic observations, not substitute passing assertions. Programmatic focus is a separate control only.

Run locally after `pnpm.cmd build`, with a task-owned `pnpm.cmd start --port 3100` server in a separate terminal:

```powershell
node scripts/diagnose-browser-focus.mjs http://127.0.0.1:3100
node scripts/diagnose-browser-focus.mjs http://127.0.0.1:3100 --headed
```

Stop that server before Playwright, which starts its own server and refuses to reuse an existing one:

```powershell
pnpm.cmd test:e2e --project=webkit-mobile --grep "keyboard skip link" --workers=1
pnpm.cmd test:e2e --project=webkit-mobile --grep "keyboard skip link" --workers=1 --headed
pnpm.cmd test:e2e
```

## Independent Linux or macOS verification

Use an approved copy of the same source and unchanged lockfile on a runner with Node 24.15.0 and pnpm 12.16.1. Do not copy Windows node_modules. No database or production secrets are needed.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps chromium webkit
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e --project=webkit-mobile --grep 'keyboard skip link' --workers=1
pnpm test:e2e
```

On Linux with an approved display/Xvfb installation, additionally run:

```sh
xvfb-run -a pnpm test:e2e --project=webkit-mobile --grep 'keyboard skip link' --workers=1 --headed
```

On macOS with an interactive desktop, use the same command without `xvfb-run -a`. Run the diagnostic script against a separately started local production server if the assertion fails. Compare whether Tab reaches ordinary anchors or only form controls; record focus before and after Tab, not only after failure. Preserve traces, screenshots, logs, JSON diagnostics, exact OS/browser versions and source/lockfile hashes.

Do not add tabindex overrides, force focus, replace Tab, skip a project or relax the focus assertions just to pass. Any browser preference correction must be documented and validated independently. A successful programmatic-focus control does not prove keyboard reachability. Acceptance requires the original assertion and full suite to pass, or an explicit founder exception; no exception has been granted.
