import Link from "next/link";
import { type Mc, type McStatus, agents, getMc, mcHref, robots, statusLabel, workSteps } from "@/data/agents";
import { solutions } from "@/data/solutions";
import { LearningLoop, PillLink, Status, statusDot } from "./parts";

/**
 * Secciones de la portada después de «Un Mc para cada área»: la familia completa
 * (agentes y robots), por dónde empezar según el giro, el aprendizaje continuo y
 * cómo trabajamos. Todo sale de `src/data/agents.ts`.
 */

const sectionTitle = "font-hero-display text-[clamp(34px,4.6vw,64px)] leading-[0.98] font-medium tracking-[-0.028em] text-balance";

function Family({ title, href, items }: { title: string; href: string; items: Mc[] }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-4">
        <h3 className="text-[15px] font-medium">{title}</h3>
        <Link href={href} className="text-[14px] text-black/60 underline-offset-4 hover:text-black hover:underline">
          Ver todos
        </Link>
      </div>
      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-1">
        {items.map((mc) => (
          <li key={mc.slug}>
            <Link
              href={mcHref(mc)}
              className="group inline-flex items-start gap-1.5 font-hero-display text-[clamp(28px,3.1vw,44px)] leading-[1.18] font-medium tracking-[-0.02em]"
            >
              <span className="underline-offset-[6px] group-hover:underline">{mc.name}</span>
              <span aria-hidden="true" className={`mt-[0.32em] size-2 shrink-0 rounded-full ${statusDot[mc.status]}`} />
              <span className="sr-only">, {statusLabel[mc.status]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HomeCatalog() {
  const legend: McStatus[] = ["disponible", "en-desarrollo", "proximamente"];
  return (
    <>
      <section aria-labelledby="familia-title" className="relative z-10 bg-white px-6 pt-24 pb-20 md:px-12 md:pt-32">
        <div className="mx-auto max-w-7xl">
          <h2 id="familia-title" className={sectionTitle}>
            Muchos Mc.
            <span className="block font-light text-black/40">Una sola familia.</span>
          </h2>
          <p className="mt-6 max-w-[54ch] text-[17px] leading-[1.55] text-[#6e6e73]">
            MACS significa muchos Mc: agentes de IA que trabajan en tus sistemas y robots que trabajan en tu
            espacio. Todos aprenden de tu operación.
          </p>
          <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:gap-16">
            <Family title="Agentes IA" href="/agentes" items={agents} />
            <Family title="Robots con IA" href="/robots" items={robots} />
          </div>
          <ul aria-label="Estados" className="mt-12 flex flex-wrap gap-x-7 gap-y-2">
            {legend.map((status) => (
              <li key={status}>
                <Status status={status} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="giros-title" className="relative z-10 bg-white px-6 py-20 md:px-12 md:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 id="giros-title" className={sectionTitle}>
            ¿Por dónde empieza tu negocio?
          </h2>
          <p className="mt-6 max-w-[54ch] text-[17px] leading-[1.55] text-[#6e6e73]">
            Cada giro tiene tareas distintas. Estos son los Mc que recomendamos para empezar.
          </p>
          <div className="mt-12 grid border-t border-black/10 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3">
            {solutions.map((solution) => (
              <div key={solution.slug} className="border-b border-black/10 py-8">
                <h3 className="font-hero-display text-[24px] leading-tight font-medium tracking-tight">
                  <Link href={`/soluciones/${solution.slug}`} className="underline-offset-[5px] hover:underline">
                    {solution.name}
                  </Link>
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {solution.team.map(({ mc: slug }) => {
                    const mc = getMc("agente", slug) ?? getMc("robot", slug);
                    if (!mc) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={mcHref(mc)}
                          className="inline-flex rounded-full border border-black/15 px-4 py-2 text-[14px] transition-colors hover:border-black hover:bg-black hover:text-white"
                        >
                          {mc.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <PillLink href="/soluciones">Ver las soluciones por giro</PillLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="aprende-title" className="relative z-10 bg-white px-6 py-20 md:px-12 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <h2 id="aprende-title" className={sectionTitle}>
              Cada corrección
              <span className="block font-light text-black/40">los hace mejores.</span>
            </h2>
            <p className="mt-6 max-w-[48ch] text-[17px] leading-[1.55] text-[#6e6e73]">
              Cuando alguien de tu equipo corrige una respuesta, confirma un defecto o ajusta una ruta, la
              corrección se guarda y mejora el siguiente resultado. Con el tiempo, cada Mc trabaja más a la
              medida de tu negocio.
            </p>
          </div>
          <LearningLoop />
        </div>
      </section>

      <section aria-labelledby="proceso-title" className="relative z-10 bg-white px-6 pt-20 pb-6 md:px-12 md:pt-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="proceso-title" className={sectionTitle}>
              Cómo trabajamos
            </h2>
            <PillLink href="/como-trabajamos">Conoce el proceso completo</PillLink>
          </div>
          <ol className="mt-12 grid gap-10 border-t border-black/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {workSteps.map((step, index) => (
              <li key={step.name}>
                <span className="font-hero-display text-[15px] font-medium text-black/40 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-hero-display text-[26px] leading-tight font-medium tracking-tight">{step.name}</h3>
                <p className="mt-3 text-[16px] leading-[1.55] text-[#6e6e73]">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
