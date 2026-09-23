import Link from "next/link";
import { getMc, mcHref } from "@/data/agents";
import { type Solution, solutions } from "@/data/solutions";
import { ContactButton, FaqList, PageHero, RingList, Row, Status } from "./parts";

/** Página de un giro: lo que se repite, el equipo de Mc, un día de ejemplo y preguntas. */
export function SolutionDetail({ solution }: { solution: Solution }) {
  const others = solutions.filter((other) => other.slug !== solution.slug);
  return (
    <>
      <PageHero
        eyebrow={
          <nav aria-label="Ruta de navegación">
            <Link href="/soluciones" className="underline-offset-4 hover:text-black hover:underline">
              Soluciones por giro
            </Link>
          </nav>
        }
        title={solution.name}
        subtitle={solution.promise}
      >
        <ContactButton interest="Diagnóstico" giro={solution.slug}>
          Quiero un diagnóstico
        </ContactButton>
      </PageHero>

      <div className="mx-auto max-w-6xl px-6 pb-6 md:px-12">
        <p className="max-w-[36ch] pb-14 font-hero-display text-[clamp(24px,3vw,38px)] leading-[1.15] tracking-[-0.015em] text-pretty md:pb-20">
          {solution.summary}
        </p>

        <Row title="Lo que se repite todos los días">
          <RingList items={solution.pains} large />
        </Row>

        <Row title="Tu equipo de Mc">
          <ul className="border-t border-black/10">
            {solution.team.map(({ mc: slug, role }) => {
              const mc = getMc("agente", slug) ?? getMc("robot", slug);
              if (!mc) return null;
              return (
                <li key={slug} className="border-b border-black/10">
                  <Link
                    href={mcHref(mc)}
                    className="group grid gap-x-6 gap-y-1 py-5 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_auto] md:items-baseline"
                  >
                    <span className="font-hero-display text-[28px] leading-tight font-medium tracking-[-0.02em] underline-offset-[6px] group-hover:underline">
                      {mc.name}
                    </span>
                    <span className="text-[16px] leading-snug text-[#6e6e73]">{role}</span>
                    <Status status={mc.status} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Row>

        <Row title="Un día con MACS">
          <ol className="space-y-7 border-l border-black/10 pl-7">
            {solution.day.map((step) => (
              <li key={step.time} className="relative">
                <span aria-hidden="true" className="mc-dot absolute top-[0.5em] -left-[33px] bg-white" />
                <p className="font-hero-display text-[15px] font-medium text-black/45 tabular-nums">{step.time}</p>
                <p className="mt-1 max-w-[56ch] text-[18px] leading-[1.5] md:text-[19px]">{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-[13px] text-black/50">
            Un día de ejemplo: muestra cómo se reparten las tareas, no resultados medidos.
          </p>
        </Row>

        {solution.faqs.length > 0 ? (
          <Row title="Preguntas frecuentes">
            <FaqList faqs={solution.faqs} />
          </Row>
        ) : null}
      </div>

      <section aria-labelledby="otros-giros" className="mx-auto max-w-6xl px-6 pt-10 pb-6 md:px-12">
        <h2 id="otros-giros" className="mb-6 font-hero-display text-[22px] font-medium tracking-tight md:text-[26px]">
          Otros giros
        </h2>
        <ul className="flex flex-wrap gap-2">
          {others.map((other) => (
            <li key={other.slug}>
              <Link
                href={`/soluciones/${other.slug}`}
                className="inline-flex rounded-full border border-black/15 px-5 py-2.5 text-[14px] transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                {other.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
