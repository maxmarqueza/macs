import type { Metadata } from "next";
import { Suspense } from "react";
import ScrollHeroLab from "@/components/hero/ScrollHeroLab";

// Vista previa (no indexada) de las opciones de manos controladas por scroll.
export const metadata: Metadata = {
  title: "Vista previa: manos por scroll",
  robots: { index: false, follow: false },
};

export default function ScrollLabPage() {
  return (
    <Suspense fallback={null}>
      <ScrollHeroLab />
    </Suspense>
  );
}
