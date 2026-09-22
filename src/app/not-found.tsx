import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Navbar, inter, outfit } from "@/components/hero/HandsTouchHero";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function NotFound() {
  return (
    <div
      className={`${inter.variable} ${outfit.variable} handstouch-page flex min-h-svh w-full flex-col bg-white font-hero-sans text-black antialiased`}
    >
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-8 pt-32 pb-16 md:px-16">
        <p className="text-[11.5px] font-medium text-black/60">Error 404</p>
        <h1 className="font-hero-display mt-3 text-[11vw] leading-[0.95] font-medium tracking-tight sm:text-[7vw] lg:text-[4.6vw]">
          Esta página no existe
        </h1>
        <p className="mt-5 max-w-[480px] text-[17px] leading-[1.5] text-[#6e6e73]">
          Puede que el enlace esté mal escrito o que ese Mc todavía no tenga ficha.
        </p>
        <div className="mt-8 flex flex-wrap gap-2.5">
          <Link
            href="/"
            className="rounded-full border border-black bg-black px-6 py-3.5 text-[11.5px] font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Ir al inicio
          </Link>
          <Link
            href="/agentes/mcmarketing"
            className="rounded-full border border-black/15 bg-white px-6 py-3.5 text-[11.5px] font-normal text-black transition-all duration-300 hover:border-black hover:bg-black hover:text-white"
          >
            Conocer a McMarketing
          </Link>
        </div>
      </main>
    </div>
  );
}
