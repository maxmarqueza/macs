import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { agents } from "@/data/agents";
import { brand, site } from "@/data/site";

// Imagen que muestran redes sociales y mensajería al compartir macstech.mx.
// Se genera una sola vez en el build (no usa APIs de request). Composición
// centrada para que sobreviva a los recortes cuadrados de WhatsApp/iMessage.

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Píldoras del roster: más de esto no cabe legible en 1200 px.
const MAX_AGENTS = 6;

const root = process.cwd();
const [geistRegular, geistBold, mark] = await Promise.all([
  readFile(join(root, "src/assets/fonts/Geist-Regular.ttf")),
  readFile(join(root, "src/assets/fonts/Geist-Bold.ttf")),
  readFile(join(root, "src/app/icon.svg"), "base64"),
]);
const markSrc = `data:image/svg+xml;base64,${mark}`;

const pill = {
  display: "flex",
  fontSize: 24,
  borderRadius: 999,
  padding: "10px 24px",
} as const;

const pillStyles = {
  activo: { ...pill, color: "#6ee7b7", border: "2px solid #047857" }, // emerald-300 / emerald-700
  proximamente: { ...pill, color: "#a3a3a3", border: "2px solid #404040" }, // neutral-400 / neutral-700
} as const;

export default function Image() {
  const shown = agents.slice(0, MAX_AGENTS);
  const hidden = agents.length - shown.length;

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
          padding: "48px 72px",
          backgroundColor: brand.background,
          backgroundImage: `radial-gradient(circle at 50% 0%, rgba(${brand.accentRgb},0.28) 0%, rgba(${brand.accentRgb},0) 55%)`,
          color: "#ffffff",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src={markSrc} width={56} height={56} alt="" />
          <span
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: brand.accent,
            }}
          >
            macstech.mx
          </span>
        </div>

        <div
          style={{
            fontSize: 176,
            fontWeight: 700,
            letterSpacing: -8,
            lineHeight: 1,
            marginTop: 28,
          }}
        >
          {site.name}
        </div>
        <div style={{ fontSize: 44, color: "#d4d4d4", marginTop: 12 }}>
          {site.tagline}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 14,
            marginTop: 44,
            maxWidth: 1000,
          }}
        >
          {shown.map((agent) => (
            <div key={agent.slug} style={pillStyles[agent.status]}>
              {agent.name}
            </div>
          ))}
          {hidden > 0 && (
            <div style={pillStyles.proximamente}>+{hidden} más</div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
        { name: "Geist", data: geistBold, weight: 700, style: "normal" },
      ],
    },
  );
}
