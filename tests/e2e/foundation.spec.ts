import { expect, test } from "@playwright/test";

test("landing page and preview navigation", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") pageErrors.push(message.text());
  });
  await page.goto("/");
  await expect(page).toHaveTitle(/PlazaHub/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/A clearer view/);
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  for (const [name, path, heading] of [
    ["Staff preview", "/preview/staff", "Your plaza workspace, taking shape."],
    ["Tenant preview", "/tenant", "Your shop, closer at hand."],
    ["Platform preview", "/preview/platform", "A separate home for platform administration."],
  ]) {
    await navigation.getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(page.getByText("A preview, not an active account")).toBeVisible();
    await expect(page.locator("input, form")).toHaveCount(0);
  }
  expect(pageErrors).toEqual([]);
});

test("keyboard skip link focuses main content", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/A clearer view/);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("all public pages fit the configured desktop or mobile viewport", async ({ page }, testInfo) => {
  for (const path of ["/", "/preview/staff", "/tenant", "/preview/platform"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      content: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      viewport: document.documentElement.clientWidth,
    }));
    expect(dimensions.content, `Horizontal overflow on ${path}`).toBeLessThanOrEqual(dimensions.viewport);
    await page.screenshot({ path: testInfo.outputPath(`${path.slice(1).replaceAll("/", "-") || "home"}.png`), fullPage: true });
  }
});

test("manifest and icons are served; no untested service worker is registered", async ({ page, request }) => {
  const response = await request.get("/manifest.webmanifest");
  expect(response.ok()).toBe(true);
  const manifest = await response.json();
  expect(response.headers()["content-type"]).toContain("application/manifest+json");
  expect(manifest).toMatchObject({ name: "PlazaHub Tenant", short_name: "PlazaHub", start_url: "/tenant", scope: "/tenant", display: "standalone", theme_color: "#142c40" });
  for (const icon of manifest.icons as Array<{ src: string; sizes: string }>) {
    const asset = await request.get(icon.src);
    expect(asset.ok()).toBe(true);
    expect(asset.headers()["content-type"]).toContain("image/png");
    const bytes = await asset.body();
    const [width, height] = icon.sizes.split("x").map(Number);
    expect(bytes.readUInt32BE(16)).toBe(width);
    expect(bytes.readUInt32BE(20)).toBe(height);
  }
  await page.goto("/tenant");
  expect(await page.evaluate(async () => "serviceWorker" in navigator ? (await navigator.serviceWorker.getRegistrations()).length : 0)).toBe(0);
  await expect(page.getByText(/Offline access and notifications are not available/)).toBeVisible();
});

test("unknown routes have an accessible recovery link", async ({ page }) => {
  const response = await page.goto("/not-a-real-account");
  expect(response?.status()).toBe(404);
  await page.getByRole("link", { name: "Back to PlazaHub" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/A clearer view/);
});
