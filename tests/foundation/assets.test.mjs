import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { localDatabaseUrl } from "../../src/lib/db/local-config.ts";

test("database guard rejects remote hosts, protocol changes and query overrides", () => {
  assert.equal(new URL(localDatabaseUrl()).hostname, "127.0.0.1");
  for (const value of [
    "postgresql://test:private-value@production.example/db",
    "postgresql://test:private-value@127.0.0.1/db?host=production.example",
    "https://localhost/db",
    "invalid",
  ]) {
    assert.throws(() => localDatabaseUrl(value), (error) => !String(error).includes("private-value"));
  }
});

test("install PNGs have correct dimensions and opaque pixel data", () => {
  for (const [name, size] of [["icon-192.png", 192], ["icon-512.png", 512], ["maskable-512.png", 512], ["apple-touch-icon.png", 180]]) {
    const bytes = readFileSync(new URL(`../../public/icons/${name}`, import.meta.url));
    assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.equal(bytes.readUInt32BE(16), size);
    assert.equal(bytes.readUInt32BE(20), size);
    const compressed = [];
    for (let cursor = 8; cursor < bytes.length;) {
      const length = bytes.readUInt32BE(cursor);
      if (bytes.toString("ascii", cursor + 4, cursor + 8) === "IDAT") compressed.push(bytes.subarray(cursor + 8, cursor + 8 + length));
      cursor += length + 12;
    }
    const pixels = inflateSync(Buffer.concat(compressed));
    assert.equal(pixels.length, (size * 4 + 1) * size);
    for (let y = 0; y < size; y++) {
      assert.equal(pixels[y * (size * 4 + 1)], 0);
      for (let x = 0; x < size; x++) {
        const offset = y * (size * 4 + 1) + 1 + x * 4;
        assert.equal(pixels[offset + 3], 255);
        if (name.startsWith("maskable") && pixels[offset] !== 20) {
          const radius = Math.hypot((x + 0.5) / size - 0.5, (y + 0.5) / size - 0.5);
          assert.ok(radius < 0.4, "Maskable mark must fit the safe circle");
        }
      }
    }
  }
});

test("schema contains only approved Task 005 identity models and no unapproved migrations", () => {
  const schema = readFileSync(new URL("../../prisma/schema.prisma", import.meta.url), "utf8");
  assert.deepEqual([...schema.matchAll(/^model\s+(\w+)/gm)].map((match) => match[1]).sort(), ["User", "Session", "Account", "Verification", "Organization", "Member", "Invitation", "TwoFactor", "RateLimit", "IdentityAuditEvent"].sort());
  assert.doesNotMatch(schema, /^\s*(enum|view)\s+\w+/m);
  assert.match(schema, /provider\s*=\s*"postgresql"/);
  assert.equal(existsSync(new URL("../../prisma/migrations", import.meta.url)), false);
  assert.deepEqual(readdirSync(new URL("../../prisma", import.meta.url)), ["schema.prisma"]);
});

test("primary design token pairs meet normal-text contrast", () => {
  const luminance = (hex) => {
    const channels = hex.match(/../g).map((part) => parseInt(part, 16) / 255).map((c) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  for (const [foreground, background] of [["142c40", "f7f9fa"], ["52616c", "f7f9fa"], ["ffffff", "14776b"], ["ffffff", "142c40"], ["125c55", "eaf4f2"]]) {
    const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    assert.ok((values[0] + 0.05) / (values[1] + 0.05) >= 4.5, `${foreground}/${background}`);
  }
});
