import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import TenantPage from "@/app/(tenant)/tenant/page";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";

describe("Public foundation experience", () => {
  it("offers real preview links and makes the lack of account access explicit", () => {
    render(<><SiteHeader /><HomePage /></>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/A clearer view/);
    const navigation = within(screen.getByRole("navigation", { name: "Main navigation" }));
    for (const [name, href] of [["Staff preview", "/preview/staff"], ["Tenant preview", "/tenant"], ["Platform preview", "/preview/platform"]]) {
      expect(navigation.getByRole("link", { name })).toHaveAttribute("href", href);
    }
    expect(screen.getByText(/Staff account access is being verified before release/)).toBeVisible();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("does not present unavailable tenant actions as working controls", () => {
    render(<TenantPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Your shop, closer at hand.");
    expect(screen.getAllByText("Not available yet")).toHaveLength(4);
    expect(screen.getByText(/Offline access and notifications are not available/)).toBeVisible();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("keeps a link's semantics when using the shadcn Button asChild pattern", () => {
    render(<Button asChild><a href="/tenant">Tenant preview</a></Button>);
    expect(screen.getByRole("link", { name: "Tenant preview" })).toHaveAttribute("href", "/tenant");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
