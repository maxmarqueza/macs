import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand } from "@/data/site";

// Ícono para pantalla de inicio en iOS (180×180). iOS recorta las esquinas él
// solo, así que el fondo va a sangre completa. Reusa la marca de `icon.svg`.

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const mark = await readFile(join(process.cwd(), "src/app/icon.svg"), "base64");
const markSrc = `data:image/svg+xml;base64,${mark}`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: brand.background,
          backgroundImage: `radial-gradient(circle at 50% 0%, rgba(${brand.accentRgb},0.35) 0%, rgba(${brand.accentRgb},0) 75%)`,
        }}
      >
        <img src={markSrc} width={180} height={180} alt="" />
      </div>
    ),
    size,
  );
}
