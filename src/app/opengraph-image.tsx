import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { agents } from "@/data/agents";
import { site } from "@/data/site";

// Imagen que muestran redes sociales y mensajería al compartir macstech.mx.
// Se genera una sola vez en el build (no usa APIs de request).

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const root = process.cwd();
const [geistRegular, geistBold, mark] = await Promise.all([
  readFile(join(root, "src/assets/fonts/Geist-Regular.ttf")),
  readFile(join(root, "src/assets/fonts/Geist-Bold.ttf")),
  readFile(join(root, "src/app/icon.svg"), "base64"),
]);
const markSrc = `data:image/svg+xml;base64,${mark}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(56,189,248,0.28) 0%, rgba(56,189,248,0) 55%)",
          color: "#ffffff",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <img src={markSrc} width={64} height={64} alt="" />
          <span
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#38bdf8",
            }}
          >
            macstech.mx
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 176,
              fontWeight: 700,
              letterSpacing: -8,
              lineHeight: 1,
            }}
          >
            {site.name}
          </div>
          <div style={{ fontSize: 46, color: "#d4d4d4", marginTop: 18 }}>
            {site.tagline}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {agents.map((agent) => (
            <div
              key={agent.slug}
              style={{
                display: "flex",
                fontSize: 24,
                color: agent.status === "activo" ? "#e5e5e5" : "#737373",
                border: "2px solid #262626",
                borderRadius: 999,
                padding: "10px 24px",
              }}
            >
              {agent.name}
            </div>
          ))}
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
