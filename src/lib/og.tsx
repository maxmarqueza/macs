// Satori (next/og) solo entiende <img>; next/image no aplica en imágenes generadas.
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Imagen para compartir de las páginas interiores (WhatsApp, redes): fondo blanco,
 * el anillo de colores del sitio, el título dentro y la marca MACS. Se genera en el
 * build, una por página.
 */

export const ogSize = { width: 1200, height: 630 };

let assets: Promise<[Buffer, Buffer, string, string]> | null = null;
function load() {
  const root = process.cwd();
  assets ??= Promise.all([
    readFile(join(root, "src/assets/fonts/Geist-Regular.ttf")),
    readFile(join(root, "src/assets/fonts/Geist-Bold.ttf")),
    readFile(join(root, "src/app/icon.svg"), "base64"),
    readFile(join(root, "src/assets/og/ring.png"), "base64"),
  ]);
  return assets;
}

export async function brandImage({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle: string }) {
  const [regular, bold, mark, ring] = await load();
  const titleSize = title.length > 22 ? 70 : title.length > 14 ? 92 : 118;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          color: "#000000",
          fontFamily: "Geist",
          position: "relative",
        }}
      >
        <img
          src={`data:image/png;base64,${ring}`}
          width={600}
          height={600}
          alt=""
          style={{ position: "absolute", left: 300, top: 15 }}
        />
        <div style={{ position: "absolute", top: 40, left: 56, display: "flex", alignItems: "center", gap: 14 }}>
          <img src={`data:image/svg+xml;base64,${mark}`} width={44} height={44} alt="" />
          <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: -1 }}>MACS</span>
        </div>
        {eyebrow ? <div style={{ display: "flex", fontSize: 26, color: "#6e6e73", marginBottom: 14 }}>{eyebrow}</div> : null}
        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            fontWeight: 700,
            letterSpacing: -0.04 * titleSize,
            lineHeight: 1,
            textAlign: "center",
            maxWidth: 1060,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 38,
            letterSpacing: -1,
            lineHeight: 1.15,
            color: "rgba(0,0,0,0.45)",
            marginTop: 20,
            textAlign: "center",
            maxWidth: 820,
            justifyContent: "center",
          }}
        >
          {subtitle}
        </div>
        <span
          style={{
            position: "absolute",
            bottom: 36,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            fontSize: 20,
            letterSpacing: 3,
            color: "rgba(0,0,0,0.5)",
          }}
        >
          MACSTECH.MX
        </span>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
