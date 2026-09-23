import type { Metadata } from "next";
import { ContactButton, FaqList, PageHero, Roster, Row } from "@/components/site/parts";
import { SiteShell } from "@/components/site/SiteShell";
import { byArea, robots } from "@/data/agents";
import { pageMetadata } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Robots con IA",
  description:
    "Robots de servicio e industriales con la inteligencia de MACS: meseros, anfitriones, limpieza, brazos colaborativos, inspección con visión y carga autónoma.",
  path: "/robots",
  ownImage: true,
});

const offer = [
  { name: "Compra o renta mensual", text: "Elige comprar el equipo o rentarlo con una cuota mensual que incluye el servicio." },
  { name: "Instalación y capacitación", text: "Visitamos tu espacio, instalamos el robot y enseñamos a tu equipo a trabajar con él." },
  { name: "Mantenimiento", text: "Revisiones programadas y soporte cuando lo necesites." },
  { name: "La capa de IA de MACS", text: "Conectamos el robot con tus sistemas y con los agentes Mc, para que sea parte de tu operación." },
];

const faqs = [
  {
    q: "¿Ya puedo tener un robot de MACS?",
    a: "Estamos preparando la línea de robots. Escríbenos con el que te interesa y te avisamos cuando haya demostraciones.",
  },
  {
    q: "¿Cómo sé si mi espacio es adecuado?",
    a: "Antes de proponer un robot hacemos una visita técnica: revisamos pisos, pasillos, conexiones y la tarea que quieres automatizar.",
  },
  {
    q: "¿Qué tienen que ver con los agentes IA?",
    a: "Comparten la misma inteligencia. Un McAnfitrión responde con el conocimiento de McSoporte, y un McBrazo reconoce piezas con McVisión.",
  },
];

export default function RobotsPage() {
  return (
    <SiteShell>
      <PageHero title="Robots con IA" subtitle="Trabajan en tu espacio y aprenden de tu operación.">
        <ContactButton interest="Robots con IA">Quiero saber cuándo llegan</ContactButton>
      </PageHero>

      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <p className="max-w-[36ch] pb-14 font-hero-display text-[clamp(24px,3vw,38px)] leading-[1.15] tracking-[-0.015em] text-pretty md:pb-20">
          Los agentes Mc trabajan en tus sistemas. Los robots Mc llevan esa misma inteligencia a tu local,
          tu almacén o tu línea de producción.
        </p>
        <Roster groups={byArea(robots)} />

        <div className="pt-16 md:pt-24">
          <Row title="Cómo los ofrecemos">
            <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {offer.map((part) => (
                <div key={part.name}>
                  <dt className="font-hero-display text-[20px] font-medium tracking-tight">{part.name}</dt>
                  <dd className="mt-2 text-[16px] leading-[1.55] text-[#6e6e73]">{part.text}</dd>
                </div>
              ))}
            </dl>
          </Row>
          <Row title="Preguntas frecuentes">
            <FaqList faqs={faqs} />
          </Row>
        </div>
      </div>
    </SiteShell>
  );
}
