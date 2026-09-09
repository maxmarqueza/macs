// Genera `src/app/favicon.ico` (16, 32 y 48 px) y `public/logo.png` (512 px)
// a partir de `src/app/icon.svg`, que es la fuente única de la marca.
//
// Uso: node scripts/brand-assets.mjs
// Usa `sharp`, que ya viene instalado como dependencia de Next.js.

import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const svg = await readFile(new URL("../src/app/icon.svg", import.meta.url));

const png = (size) => sharp(svg).resize(size, size).png().toBuffer();

// ICO con entradas PNG (soportado por todos los navegadores actuales).
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reservado
  header.writeUInt16LE(1, 2); // tipo: icono
  header.writeUInt16LE(images.length, 4);

  const dir = Buffer.alloc(16 * images.length);
  let offset = header.length + dir.length;
  images.forEach(({ size, data }, i) => {
    const e = 16 * i;
    dir.writeUInt8(size >= 256 ? 0 : size, e); // ancho
    dir.writeUInt8(size >= 256 ? 0 : size, e + 1); // alto
    dir.writeUInt8(0, e + 2); // paleta
    dir.writeUInt8(0, e + 3); // reservado
    dir.writeUInt16LE(1, e + 4); // planos
    dir.writeUInt16LE(32, e + 6); // bits por píxel
    dir.writeUInt32LE(data.length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });

  return Buffer.concat([header, dir, ...images.map((i) => i.data)]);
}

const sizes = [16, 32, 48];
const images = await Promise.all(
  sizes.map(async (size) => ({ size, data: await png(size) })),
);
await writeFile(new URL("../src/app/favicon.ico", import.meta.url), ico(images));
await writeFile(new URL("../public/logo.png", import.meta.url), await png(512));

console.log(`favicon.ico (${sizes.join(", ")} px) y public/logo.png (512 px) generados`);
