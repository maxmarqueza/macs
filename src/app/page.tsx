import type { Metadata, Viewport } from "next";
import ScrollHero from "@/components/hero/ScrollHero";
import { openGraphBase, site } from "@/data/site";

// Portada: Halion (clon literal) y después el diseño de vikod3/handstouch con textos
// de MACS y las manos controladas por el scroll (ver src/components/hero/ScrollHero.tsx).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    ...openGraphBase,
    url: "/",
    title: site.title,
    description: site.ogDescription,
  },
};

// La portada abre con Halion (negro): la barra del navegador también (theme-color del original).
export const viewport: Viewport = { themeColor: "#000000" };

export default function Home() {
  return <ScrollHero />;
}
