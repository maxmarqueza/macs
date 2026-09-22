import type { Metadata, Viewport } from "next";
import ScrollHero from "@/components/hero/ScrollHero";
import { openGraphBase, site } from "@/data/site";

// Portada: diseño de vikod3/handstouch con textos de MACS y las manos controladas
// por el scroll, variante B (ver src/components/hero/ScrollHero.tsx).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    ...openGraphBase,
    url: "/",
    title: site.title,
    description: site.ogDescription,
  },
};

// La portada es blanca en ambos esquemas: la barra del navegador debe serlo también.
export const viewport: Viewport = { themeColor: "#ffffff" };

export default function Home() {
  return <ScrollHero />;
}
