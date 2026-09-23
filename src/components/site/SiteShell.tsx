import type { ReactNode } from "react";
import { Navbar, SiteFooter, inter, outfit } from "@/components/hero/HandsTouchHero";

/** Marco de las páginas interiores: la misma barra, tipografías y cierre que la portada. */
export function SiteShell({ children, footerCta = true }: { children: ReactNode; footerCta?: boolean }) {
  return (
    <div
      className={`${inter.variable} ${outfit.variable} handstouch-page flex min-h-svh w-full flex-col bg-white font-hero-sans text-black antialiased selection:bg-black selection:text-white`}
    >
      <a
        href="#contenido"
        className="sr-only rounded-full bg-black px-5 py-3 text-[14px] text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]"
      >
        Saltar al contenido
      </a>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-40 bg-linear-to-b from-white via-white/90 to-transparent sm:h-28 md:h-32"
      />
      <Navbar />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <SiteFooter cta={footerCta} />
    </div>
  );
}
