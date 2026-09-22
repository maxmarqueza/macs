import type { Metadata } from "next";
import Link from "next/link";
import HeroScene from "@/components/hero/HeroScene";
import { agents } from "@/data/agents";
import { openGraphBase, site } from "@/data/site";

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
  return (
    <main className="flex-1">
      {/* Hero: manos humana y robótica sobre video ambiental (ver src/components/hero) */}
      <section
        aria-labelledby="hero-title"
        className="relative flex min-h-svh flex-col overflow-hidden bg-white text-neutral-950"
      >
        <HeroScene>
          <div className="flex flex-1 flex-col items-center justify-center px-6 pt-24 pb-6 text-center sm:pt-28">
            <div className="translate-y-4 motion-safe:animate-hero-rise [animation-delay:200ms]">
              <p className="mb-4 font-mono text-xs tracking-[0.3em] text-sky-700 uppercase sm:mb-5 sm:text-sm">
                macstech.mx
              </p>
              <h1
                id="hero-title"
                className="text-[22vw] leading-[0.85] font-bold tracking-tighter sm:text-[14vw] lg:text-[8.5vw]"
              >
                MACS
              </h1>
              <p className="mt-3 text-[7.5vw] leading-[0.95] font-medium tracking-tight text-balance sm:mt-4 sm:text-[4.6vw] lg:text-[3vw]">
                <span className="inline-block font-light text-neutral-950/35">
                  Muchos Mc,
                </span>{" "}
                <span className="inline-block">un solo objetivo</span>
              </p>
            </div>
          </div>

          <div className="motion-safe:animate-hero-rise px-6 pb-10 [animation-delay:500ms] md:px-12 md:pb-14">
            <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-sm">
                <p className="mb-2 text-xs font-medium tracking-wide text-neutral-500">
                  {site.tagline}
                </p>
                <p className="text-lg leading-snug tracking-tight sm:text-xl">
                  Cada <span className="font-semibold">Mc</span> es un agente de
                  inteligencia artificial especializado que automatiza una parte
                  de tu negocio.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#agentes"
                  className="rounded-full bg-sky-400 px-6 py-3 font-medium text-neutral-950 transition hover:bg-sky-300"
                >
                  Conoce a los Mc
                </a>
                <a
                  href="#contacto"
                  className="rounded-full border border-neutral-300 bg-white/70 px-6 py-3 font-medium text-neutral-800 backdrop-blur-sm transition hover:border-neutral-950 hover:text-neutral-950"
                >
                  Contacto
                </a>
              </div>
            </div>
          </div>
        </HeroScene>
      </section>

      {/* Concepto */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">¿Qué es un Mc?</h2>
        <p className="mt-4 max-w-3xl text-lg text-neutral-600 dark:text-neutral-400">
          Un Mc es un agente de IA con una especialidad clara — software, o
          hardware con software — que trabaja para ti las 24 horas. En lugar de
          contratar un equipo para cada área, sumas al Mc que resuelve ese
          problema.
        </p>
      </section>

      {/* Roster de agentes */}
      <section id="agentes" className="bg-neutral-50 dark:bg-neutral-900">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-3xl font-bold tracking-tight">La familia MACS</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {agents.map((agent) => (
              <article
                key={agent.slug}
                className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{agent.emoji}</span>
                  {agent.status === "activo" ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                      Activo
                    </span>
                  ) : (
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                      Próximamente
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-xl font-semibold">{agent.name}</h3>
                <p className="text-sm font-medium text-sky-600 dark:text-sky-400">
                  {agent.tagline}
                </p>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {agent.description}
                </p>
                <ul className="mt-4 space-y-1 text-sm text-neutral-500">
                  {agent.capabilities.map((cap) => (
                    <li key={cap} className="flex items-start gap-2">
                      <span aria-hidden className="text-sky-500">
                        ✓
                      </span>
                      {cap}
                    </li>
                  ))}
                </ul>
                {agent.href && (
                  <Link
                    href={agent.href}
                    className="mt-6 inline-flex min-h-11 items-center gap-2 self-start rounded-lg text-sm font-semibold text-sky-700 underline-offset-4 hover:underline dark:text-sky-400"
                  >
                    Conoce a {agent.name}
                    <span aria-hidden>→</span>
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section
        id="contacto"
        className="mx-auto max-w-5xl px-6 py-20 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight">
          ¿Qué parte de tu negocio quieres automatizar?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
          Cuéntanos qué necesitas y te decimos qué Mc lo resuelve.
        </p>
        <a
          href={`mailto:${site.email}`}
          className="mt-8 inline-block rounded-full bg-sky-400 px-8 py-3 font-medium text-neutral-950 transition hover:bg-sky-300"
        >
          {site.email}
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-8 text-center text-sm text-neutral-500 dark:border-neutral-800">
        © {new Date().getFullYear()} MACS · macstech.mx
      </footer>
    </main>
  );
}
