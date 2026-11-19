import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SignInForm } from "@/components/identity/sign-in-form";
afterEach(() => vi.unstubAllGlobals());

describe("Staff sign-in UI", () => {
  it("provides labelled fields and a clear unavailable state", () => {
    render(<SignInForm available={false} />);
    expect(screen.getByLabelText("Email address")).toHaveAttribute("autoComplete", "username");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: "Sign in" })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("not configured");
  });
  it("moves to the authenticator challenge without claiming a signed-in session", async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json({ ok: true, twoFactorRedirect: true }));
    vi.stubGlobal("fetch", fetch);
    render(<SignInForm available />);
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "staff@example.test" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "testing-password" } });
    fireEvent.submit(screen.getByRole("button", { name: "Sign in" }).closest("form")!);
    await waitFor(() => expect(screen.getByLabelText("Authenticator code")).toBeVisible());
    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Use a backup code" }));
    expect(screen.getByLabelText("Backup code")).toBeVisible();
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
