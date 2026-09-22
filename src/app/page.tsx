import type { Metadata } from "next";
import HandsTouchHero from "@/components/hero/HandsTouchHero";
import { openGraphBase } from "@/data/site";

// Portada = la página de vikod3/handstouch tal cual (decisión de Max, 2026-09-22):
// título, descripción y contenido del original, sin secciones de MACS.
const title = "NeuralKinetics";
const description =
  "NeuralKinetics unifies biological grace with machine intelligence.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    ...openGraphBase,
    url: "/",
    title,
    description,
  },
};

export default function Home() {
  return <HandsTouchHero />;
}
