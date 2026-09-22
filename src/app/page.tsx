import type { Metadata } from "next";
import HandsTouchHero from "@/components/hero/HandsTouchHero";
import { openGraphBase, site } from "@/data/site";

// Portada: diseño de vikod3/handstouch con textos de MACS (ver src/components/hero).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    ...openGraphBase,
    url: "/",
    title: site.title,
    description: site.ogDescription,
  },
};

export default function Home() {
  return <HandsTouchHero />;
}
