import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand, site } from "@/data/site";

// Imagen que muestran redes sociales y mensajería al compartir macstech.mx.
// Misma escena que la portada: fondo blanco, «MACS / inteligencia hecha
// humana» y las manos humana y robótica tocándose (cuadro final del video).
// Se genera una sola vez en el build.

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const root = process.cwd();
const [geistRegular, geistBold, mark, hands] = await Promise.all([
  readFile(join(root, "src/assets/fonts/Geist-Regular.ttf")),
  readFile(join(root, "src/assets/fonts/Geist-Bold.ttf")),
  readFile(join(root, "src/app/icon.svg"), "base64"),
  readFile(join(root, "src/assets/og/hands-touch.png"), "base64"),
]);
const markSrc = `data:image/svg+xml;base64,${mark}`;
const handsSrc = `data:image/png;base64,${hands}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#ffffff",
          backgroundImage:
            "radial-gradient(circle at 50% 42%, rgba(56,189,248,0.10) 0%, rgba(255,255,255,0) 46%)",
          color: "#000000",
          fontFamily: "Geist",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 56,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <img src={markSrc} width={44} height={44} alt="" />
          <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: -1 }}>{site.name}</span>
        </div>
        <span style={{ position: "absolute", top: 50, right: 56, fontSize: 20, color: "#6e6e73" }}>
          {site.tagline}
        </span>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 118,
          }}
        >
          <div style={{ fontSize: 132, fontWeight: 700, letterSpacing: -6, lineHeight: 1 }}>
            {site.name}
          </div>
          <div style={{ display: "flex", fontSize: 54, letterSpacing: -2, lineHeight: 1.05, marginTop: 6 }}>
            <span style={{ color: "rgba(0,0,0,0.42)", marginRight: 14 }}>inteligencia</span>
            <span style={{ fontWeight: 700 }}>hecha humana</span>
          </div>
        </div>

        <img
          src={handsSrc}
          width={1200}
          height={400}
          alt=""
          style={{ position: "absolute", left: 0, bottom: -30, width: 1200, height: 400 }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 90,
            backgroundImage: "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0) 100%)",
          }}
        />
        <span
          style={{
            position: "absolute",
            bottom: 28,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            fontSize: 22,
            letterSpacing: 4,
            color: brand.accent,
          }}
        >
          MACSTECH.MX
        </span>
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
