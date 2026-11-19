import { expect, test } from "@playwright/test";

test("anonymous staff and platform requests cannot expose account data", async ({ page, request }) => {
  for (const path of ["/staff", "/platform"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/sign-in$/);
    await expect(page.getByRole("heading", { level: 1, name: "Staff sign-in" })).toBeVisible();
    await expect(page.getByText("Staff members", { exact: true })).toHaveCount(0);
  }
  const response = await request.get("/api/identity", { headers: { cookie: "better-auth.session_token=forged" } });
  expect(response.status()).toBe(401);
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(await response.json()).toEqual({ error: "Sign in to continue." });
});

test("public signup, organization creation, invitations and reset are closed", async ({ request }) => {
  for (const path of ["sign-up/email", "organization/create", "organization/accept-invitation", "organization/update-member-role", "request-password-reset"]) {
    const response = await request.post(`/api/auth/${path}`, { data: { role: "owner", organizationId: "guessed-org" } });
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ error: "This operation is unavailable." });
  }
});

test("sign-in is labelled, responsive and safely closed in an unconfigured production build", async ({ page, request }) => {
  await page.goto("/sign-in");
  await expect(page.getByLabel("Email address")).toHaveAttribute("autocomplete", "username");
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute("type", "password");
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeDisabled();
  await expect(page.getByRole("status")).toContainText("not configured");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const response = await request.post("/api/auth/sign-in/email", { data: { email: "unknown@example.test", password: "not-a-real-credential" } });
  expect(response.status()).toBe(503);
  expect(await response.json()).toEqual({ error: "Staff access is temporarily unavailable." });
});
