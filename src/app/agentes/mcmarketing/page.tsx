import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { agents } from "@/data/agents";
import { openGraphBase, site } from "@/data/site";

const title = "McMarketing — Marketing automatizado en redes sociales";
const description =
  "Conoce McMarketing, el agente de MACS que publica contenido diariamente y responde comentarios y mensajes directos automáticamente con flujos de n8n.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/agentes/mcmarketing" },
  openGraph: {
    ...openGraphBase,
    title: `${title} | ${site.name}`,
    description,
    url: "/agentes/mcmarketing",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: site.title },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
    title: `${title} | ${site.name}`,
    description,
  },
};

const capabilityDetails = [
  {
    label: "Publicaciones",
    description:
      "Publica contenido automáticamente todos los días en redes sociales.",
  },
  {
    label: "Comentarios",
    description:
      "Responde automáticamente a los comentarios que recibe en redes sociales.",
  },
  {
    label: "Mensajes directos",
    description:
      "Contesta los mensajes directos automáticamente para dar respuesta también en privado.",
  },
];

const faqs = [
  {
    question: "¿Qué hace McMarketing?",
    answer:
      "Automatiza tres tareas de marketing en redes sociales: la publicación diaria de contenido, las respuestas a comentarios y las respuestas a mensajes directos.",
  },
  {
    question: "¿Qué tecnología utiliza?",
    answer:
      "McMarketing utiliza n8n para sus flujos de automatización.",
  },
  {
    question: "¿Cómo puedo saber si encaja con mi negocio?",
    answer:
      "Cuéntanos en qué redes trabajas y qué tareas quieres automatizar. Así podemos conversar sobre el alcance que necesitas para tu negocio.",
  },
];

function CapabilityIcon({ index }: { index: number }) {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {index === 0 ? (
        <>
          <rect x="4" y="5" width="16" height="16" rx="3" />
          <path d="M8 3v4m8-4v4M4 11h16m-12 5 2 2 5-5" />
        </>
      ) : index === 1 ? (
        <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H9l-5 3v-6a7.5 7.5 0 0 1 6-12h2.5a7.5 7.5 0 0 1 7.5 7.5ZM8 10h8m-8 4h5" />
      ) : (
        <>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="m4 7 8 6 8-6" />
        </>
      )}
    </svg>
  );
}

export default function McMarketingPage() {
  const agent = agents.find((item) => item.slug === "mcmarketing");

  if (!agent) notFound();

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.15),transparent_65%)]"
        />
        <div className="relative mx-auto max-w-5xl px-6 pt-8 pb-20 sm:pb-24">
          <nav aria-label="Ruta de navegación" className="text-sm">
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <li>
                <Link
                  href="/#agentes"
                  className="rounded-sm text-neutral-400 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
                >
                  <span aria-hidden="true">← </span>
                  La familia MACS
                </Link>
              </li>
              <li aria-hidden="true" className="text-neutral-600">/</li>
              <li aria-current="page" className="text-neutral-200">
                {agent.name}
              </li>
            </ol>
          </nav>

          <div className="mt-16 flex flex-wrap items-center gap-4 sm:mt-20">
            <span
              aria-hidden="true"
              className="flex size-14 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-3xl"
            >
              {agent.emoji}
            </span>
            <span
              className={
                agent.status === "activo"
                  ? "inline-flex items-center gap-2 rounded-full bg-emerald-950 px-3 py-1.5 text-xs font-medium text-emerald-300"
                  : "inline-flex items-center gap-2 rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-300"
              }
            >
              <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
              {agent.status === "activo" ? "Activo" : "Próximamente"}
            </span>
          </div>
          <p className="mt-8 font-mono text-xs tracking-widest text-sky-400 uppercase sm:text-sm">
            Marketing automatizado en redes sociales
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {agent.name}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-neutral-300 sm:text-2xl">
            {agent.description}
          </p>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              href="/#contacto"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-sky-400 px-6 py-3 font-semibold text-neutral-950 transition hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
            >
              Hablemos de tu marketing <span aria-hidden="true">↗</span>
            </Link>
            <a
              href="#capacidades"
              className="inline-flex min-h-12 items-center rounded-full px-4 py-3 text-sm font-medium text-neutral-300 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
            >
              Explora lo que hace <span aria-hidden="true" className="ml-2">↓</span>
            </a>
          </div>
        </div>
      </section>

      <section
        id="capacidades"
        aria-labelledby="capacidades-heading"
        className="scroll-mt-8 bg-neutral-50 dark:bg-neutral-900"
      >
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-widest text-sky-700 uppercase dark:text-sky-400">
              Su especialidad
            </p>
            <h2 id="capacidades-heading" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Del contenido a la conversación.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
              Un Mc para publicar cada día y responder tanto en los comentarios
              como en los mensajes directos.
            </p>
          </div>

          <figure className="mt-12">
            <figcaption className="flex flex-wrap items-center justify-between gap-3 rounded-t-2xl border border-neutral-200 bg-white px-6 py-5 dark:border-neutral-800 dark:bg-neutral-950">
              <span className="font-medium">Tres tareas que automatiza {agent.name}</span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 font-mono text-xs text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
                Flujos con n8n
              </span>
            </figcaption>
            <div className="grid overflow-hidden rounded-b-2xl border-x border-b border-neutral-200 bg-white md:grid-cols-3 dark:border-neutral-800 dark:bg-neutral-950">
              {agent.capabilities.map((capability, index) => (
                <div
                  key={capability}
                  className="border-t border-neutral-200 p-6 first:border-t-0 md:border-t-0 md:border-l md:first:border-l-0 dark:border-neutral-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400">
                      <CapabilityIcon index={index} />
                    </span>
                    <span aria-hidden="true" className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                      0{index + 1}
                    </span>
                  </div>
                  <p className="mt-6 font-mono text-xs tracking-wide text-neutral-500 dark:text-neutral-400">
                    {capabilityDetails[index]?.label}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug">
                    {capability}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {capabilityDetails[index]?.description}
                  </p>
                </div>
              ))}
            </div>
          </figure>
        </div>
      </section>

      <section aria-labelledby="preguntas-heading" className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-16">
          <div>
            <p className="font-mono text-xs tracking-widest text-sky-700 uppercase dark:text-sky-400">
              Conoce al Mc
            </p>
            <h2 id="preguntas-heading" className="mt-3 text-3xl font-bold tracking-tight">
              Preguntas frecuentes
            </h2>
          </div>
          <div className="divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-1">
                <summary className="cursor-pointer rounded-sm py-5 pr-2 font-medium marker:text-sky-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500 dark:marker:text-sky-400">
                  <span className="pl-2">{faq.question}</span>
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="contacto-heading" className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-2xl border border-sky-100 bg-sky-50 px-6 py-10 sm:px-10 dark:border-sky-900 dark:bg-sky-950/40">
          <h2 id="contacto-heading" className="max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">
            Cuéntanos qué quieres automatizar en tus redes.
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-neutral-600 dark:text-neutral-400">
            Hablemos de las publicaciones, los comentarios y los mensajes que
            forman parte del día a día de tu negocio.
          </p>
          <Link
            href="/#contacto"
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-neutral-950 px-6 py-3 font-medium text-white transition hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500 dark:bg-sky-400 dark:text-neutral-950 dark:hover:bg-sky-300"
          >
            Contactar a MACS <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-neutral-200 px-6 py-8 dark:border-neutral-800">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 text-sm text-neutral-500 dark:text-neutral-400">
          <span>© {new Date().getFullYear()} {site.name} · macstech.mx</span>
          <Link
            href="/#agentes"
            className="rounded-sm transition hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500 dark:hover:text-sky-400"
          >
            Conoce a los otros Mc <span aria-hidden="true">→</span>
          </Link>
        </div>
      </footer>
    </main>
  );
}
