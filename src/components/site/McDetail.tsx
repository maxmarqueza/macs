import Link from "next/link";
import { type Mc, kindPath, mcHref, mcs } from "@/data/agents";
import { site } from "@/data/site";
import { ContactButton, FaqList, PageHero, RingList, Roster, Row, Status, Tags } from "./parts";

const kindLabel = { agente: "Agentes IA", robot: "Robots con IA" } as const;

/** Ficha de un Mc (agente o robot), generada desde `src/data/agents.ts`. */
export function McDetail({ mc }: { mc: Mc }) {
  const siblings = mcs.filter((other) => other.kind === mc.kind && other.area === mc.area && other.slug !== mc.slug);
  const cta = mc.status === "proximamente" ? "Quiero saber cuándo llega" : `Escríbenos sobre ${mc.name}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: mc.name,
    serviceType: mc.kind === "robot" ? "Robot con inteligencia artificial" : "Agente de inteligencia artificial",
    description: mc.summary,
    areaServed: "MX",
    url: `${site.url}${mcHref(mc)}`,
    provider: { "@id": `${site.url}/#organization` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero
        large
        eyebrow={
          <nav aria-label="Ruta de navegación">
            <Link href={kindPath[mc.kind]} className="underline-offset-4 hover:text-black hover:underline">
              {kindLabel[mc.kind]}
            </Link>
            <span aria-hidden="true" className="mx-2 text-black/30">
              /
            </span>
            <span>{mc.area}</span>
          </nav>
        }
        title={mc.name}
        subtitle={mc.promise}
      >
        <span className="inline-flex items-center rounded-full bg-[#F4F4F6] px-5 py-3">
          <Status status={mc.status} />
        </span>
        <ContactButton interest={mc.name}>{cta}</ContactButton>
      </PageHero>

      <div className="mx-auto max-w-6xl px-6 pb-6 md:px-12">
        <p className="max-w-[34ch] pb-14 font-hero-display text-[clamp(24px,3vw,38px)] leading-[1.15] font-normal tracking-[-0.015em] text-pretty md:pb-20">
          {mc.summary}
        </p>

        <Row title="Qué hace">
          <RingList items={mc.tasks} large />
        </Row>
        <Row title={mc.kind === "robot" ? "Se integra con" : "Se conecta con"}>
          <Tags items={mc.connects} />
        </Row>
        <Row title="Ideal para">
          <Tags items={mc.idealFor} />
        </Row>
        <Row title="Cómo mejora con el tiempo">
          <p className="max-w-[58ch] text-[18px] leading-[1.55] md:text-[20px]">{mc.learns}</p>
        </Row>
        <Row title="Qué medimos">
          <RingList items={mc.measures} />
        </Row>
        <Row title="Preguntas frecuentes">
          <FaqList faqs={mc.faqs} />
        </Row>
      </div>

      {siblings.length > 0 ? (
        <section aria-label={`Más Mc de ${mc.area}`} className="mx-auto max-w-6xl px-6 pt-10 pb-6 md:px-12">
          <h2 className="mb-6 font-hero-display text-[22px] font-medium tracking-tight md:text-[26px]">
            También en {mc.area.toLowerCase()}
          </h2>
          <Roster groups={[{ area: mc.area, items: siblings }]} />
        </section>
      ) : null}
    </>
  );
}
