import { chromium, webkit, devices } from "@playwright/test";
import { createServer } from "node:http";
import { mkdir, writeFile } from "node:fs/promises";
import { platform, release } from "node:os";

// Diagnostic only: never replaces or changes the foundation assertions.
// Start the production preview separately, then supply its loopback URL.
const appUrl = new URL(process.argv[2] ?? "http://127.0.0.1:3100");
if (appUrl.protocol !== "http:" || !["127.0.0.1", "localhost", "[::1]"].includes(appUrl.hostname)) {
  throw new Error("Use only a local HTTP preview URL.");
}
const headed = process.argv.includes("--headed");
const output = new URL(`../.cache/task004c/${headed ? "headed" : "headless"}.json`, import.meta.url);
await mkdir(new URL("../.cache/task004c/", import.meta.url), { recursive: true });
const server = createServer((_request, response) => {
  response.writeHead(200, { "Content-Type": "text/html" });
  response.end('<!doctype html><html lang="en"><head><title>Focus control</title></head><body><a href="#main-content">Skip to main content</a><a href="#other">Other link</a><main id="main-content" tabindex="-1">Content</main><input aria-label="Keyboard control"></body></html>');
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const minimalUrl = `http://127.0.0.1:${server.address().port}`;
const report = { timestamp: new Date().toISOString(), platform: platform(), release: release(), node: process.version, headed, results: [] };

async function snapshot(page, stage) {
  return page.evaluate(stage => {
    const active = document.activeElement;
    return {
      stage, hasFocus: document.hasFocus(), visibility: document.visibilityState,
      active: { tag: active?.tagName, id: active?.id, text: active?.textContent?.trim().slice(0, 80) },
      hash: location.hash,
      events: window.__plazaFocusDiagnostic.splice(0),
    };
  }, stage);
}

try {
  for (const engine of [chromium, webkit]) {
    const browser = await engine.launch({ headless: !headed });
    try {
      for (const [device, settings] of [["desktop", { viewport: { width: 1280, height: 900 } }], ["mobile", devices["iPhone 13"]]]) {
        for (const [target, url] of [["minimal", minimalUrl], ["application", appUrl.href]]) {
          const context = await browser.newContext(settings);
          try {
            await context.addInitScript(() => {
              window.__plazaFocusDiagnostic = [];
              for (const type of ["keydown", "keyup", "focus", "blur", "focusin", "focusout"]) {
                window.addEventListener(type, event => {
                  window.__plazaFocusDiagnostic.push({
                    type, key: event.key, code: event.code, trusted: event.isTrusted,
                    target: event.target?.id || event.target?.nodeName || "window",
                  });
                }, true);
              }
            });
            const page = await context.newPage();
            const result = { engine: engine.name(), version: browser.version(), device, target, errors: [], snapshots: [] };
            page.on("pageerror", error => result.errors.push(error.message));
            page.on("console", message => { if (message.type() === "error") result.errors.push(message.text()); });
            await page.goto(url);
            result.snapshots.push(await snapshot(page, "initial"));
            await page.keyboard.press("Tab");
            result.snapshots.push(await snapshot(page, "original-Tab"));
            await page.keyboard.press("Enter");
            result.snapshots.push(await snapshot(page, "original-Enter"));
            await page.goto(url);
            await page.bringToFront();
            await page.keyboard.press("Tab");
            result.snapshots.push(await snapshot(page, "bringToFront-Tab"));
            await page.goto(url);
            await page.keyboard.press("Alt+Tab");
            result.snapshots.push(await snapshot(page, "alternate-Tab"));
            await page.goto(url);
            await page.mouse.click(1, 1);
            await page.keyboard.press("Tab");
            result.snapshots.push(await snapshot(page, "mouse-activation-Tab"));
            await page.goto(url);
            // Probe delivery/activation separately; this is NOT a keyboard-navigation pass.
            await page.getByRole("link", { name: "Skip to main content" }).focus();
            result.snapshots.push(await snapshot(page, "programmatic-focus-control"));
            await page.keyboard.press("Enter");
            result.snapshots.push(await snapshot(page, "programmatic-focus-Enter"));
            if (target === "minimal") {
              await page.getByRole("textbox").click();
              await page.keyboard.type("probe");
              result.inputValue = await page.getByRole("textbox").inputValue();
              result.snapshots.push(await snapshot(page, "text-input-control"));
            }
            report.results.push(result);
            console.log(JSON.stringify({ engine: result.engine, headed, device, target,
              states: result.snapshots.map(s => ({ stage: s.stage, hasFocus: s.hasFocus, active: s.active.tag + "#" + s.active.id, keyEvents: s.events.filter(e => e.type === "keydown").map(e => e.key) })),
              inputValue: result.inputValue, errors: result.errors }));
          } finally { await context.close(); }
        }
      }
    } finally { await browser.close(); }
  }
} finally {
  await writeFile(output, JSON.stringify(report, null, 2) + "\n");
  await new Promise(resolve => server.close(resolve));
}
console.log(`Diagnostic evidence saved to ${output.pathname}`);
