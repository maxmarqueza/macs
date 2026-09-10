import type { Metadata } from "next";
import Link from "next/link";
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.15),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-5xl px-6 py-28 text-center">
          <p className="mb-4 font-mono text-sm tracking-widest text-sky-400 uppercase">
            macstech.mx
          </p>
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            MACS
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-300 sm:text-xl">
            Muchos <span className="font-semibold text-white">Mc</span>, un
            solo objetivo: cada Mc es un agente de inteligencia artificial
            especializado que automatiza una parte de tu negocio.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#agentes"
              className="rounded-full bg-sky-400 px-6 py-3 font-medium text-neutral-950 transition hover:bg-sky-300"
            >
              Conoce a los Mc
            </a>
            <a
              href="#contacto"
              className="rounded-full border border-neutral-700 px-6 py-3 font-medium text-neutral-200 transition hover:border-neutral-500 hover:text-white"
            >
              Contacto
            </a>
          </div>
        </div>
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
