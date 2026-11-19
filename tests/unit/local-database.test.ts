import { describe, expect, it } from "vitest";
import { localDatabaseUrl } from "@/lib/db/local-config";

describe("Task 004 local database guard", () => {
  it("permits the documented local development URL", () => {
    expect(new URL(localDatabaseUrl()).hostname).toBe("127.0.0.1");
  });

  it.each([
    "postgresql://user:secret@production.example.com/db",
    "postgresql://user:secret@localhost/db?host=production.example.com",
    "https://localhost/db",
    "not a URL",
  ])("rejects non-local or override URL %s without disclosing its password", (value) => {
    expect(() => localDatabaseUrl(value)).toThrow();
    try { localDatabaseUrl(value); } catch (error) {
      expect(String(error)).not.toContain("secret");
    }
  });
});
