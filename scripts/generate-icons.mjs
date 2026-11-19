import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { fileURLToPath } from "node:url";

// Deterministic original geometric artwork. No downloaded or generated imagery.
// The maskable glyph stays inside the central safe circle; background is opaque.
const directory = fileURLToPath(new URL("../public/icons/", import.meta.url));
mkdirSync(directory, { recursive: true });

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type, "ascii");
  const size = Buffer.alloc(4);
  size.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([size, name, data, checksum]);
}

function createIcon(size) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = (x + 0.5) / size;
      const py = (y + 0.5) / size;
      const glyph = py >= 0.28 && py <= 0.72 && px >= 0.28 && px <= 0.72 &&
        (py <= 0.40 || px <= 0.40 || px >= 0.60);
      const color = glyph ? [119, 211, 191, 255] : [20, 44, 64, 255];
      const offset = y * (size * 4 + 1) + 1 + x * 4;
      for (let channel = 0; channel < 4; channel++) raw[offset + channel] = color[channel];
    }
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // 8-bit channel depth
  header[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0)),
  ]);
}

for (const [name, size] of [["icon-192.png", 192], ["icon-512.png", 512], ["maskable-512.png", 512], ["apple-touch-icon.png", 180]]) {
  writeFileSync(`${directory}/${name}`, createIcon(size));
  console.log(`Created ${name}: ${size} × ${size}, opaque PNG`);
}
