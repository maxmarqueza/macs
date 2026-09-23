import type { Metadata } from "next";
import Link from "next/link";
import { ContactButton, PageHero, Row } from "@/components/site/parts";
import { SiteShell } from "@/components/site/SiteShell";
import { getMc } from "@/data/agents";
import { pageMetadata } from "@/data/site";
import { solutions } from "@/data/solutions";

export const metadata: Metadata = pageMetadata({
  title: "Soluciones por giro",
  description:
    "Restaurantes, clínicas, comercios, distribuidoras, manufactura y servicios profesionales: los agentes IA y robots de MACS que conviene poner a trabajar primero en cada giro.",
  path: "/soluciones",
  ownImage: true,
});

export default function SolucionesPage() {
  return (
    <SiteShell>
      <PageHero title="Soluciones por giro" subtitle="Los Mc que necesita tu tipo de negocio.">
        <ContactButton interest="Diagnóstico">Cuéntanos de tu negocio</ContactButton>
      </PageHero>

      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <p className="max-w-[36ch] pb-14 font-hero-display text-[clamp(24px,3vw,38px)] leading-[1.15] tracking-[-0.015em] text-pretty md:pb-20">
          Cada giro repite tareas distintas. Aquí están los Mc con los que recomendamos empezar en cada uno.
        </p>

        <ul className="border-t border-black/10">
          {solutions.map((solution) => (
            <li key={solution.slug} className="border-b border-black/10">
              <Link
                href={`/soluciones/${solution.slug}`}
                className="group grid gap-x-12 gap-y-3 py-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:py-10"
              >
                <span className="font-hero-display text-[32px] leading-[1.05] font-medium tracking-[-0.02em] underline-offset-[6px] group-hover:underline md:text-[44px]">
                  {solution.name}
                </span>
                <span>
                  <span className="block text-[18px] leading-snug md:text-[19px]">{solution.promise}</span>
                  <span className="mt-2 block text-[14px] text-black/50">
                    {solution.team
                      .map(({ mc }) => (getMc("agente", mc) ?? getMc("robot", mc))?.name)
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="pt-16 md:pt-24">
          <Row title="¿Tu giro no está aquí?">
            <p className="max-w-[48ch] text-[18px] leading-[1.55] md:text-[20px]">
              Los Mc se adaptan a casi cualquier negocio. Cuéntanos qué tareas se repiten en el tuyo y te decimos
              por dónde empezar.
            </p>
            <div className="mt-8">
              <ContactButton interest="Diagnóstico">Escríbenos</ContactButton>
            </div>
          </Row>
        </div>
      </div>
    </SiteShell>
  );
}
