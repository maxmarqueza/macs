import type { ReactNode } from "react";
import { Navbar, SiteFooter, inter, outfit } from "@/components/hero/HandsTouchHero";

/** Marco de las páginas interiores: la misma barra, tipografías y cierre que la portada. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${inter.variable} ${outfit.variable} handstouch-page flex min-h-svh w-full flex-col bg-white font-hero-sans text-black antialiased selection:bg-black selection:text-white`}
    >
      <Navbar />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
