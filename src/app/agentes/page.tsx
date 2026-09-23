import type { Metadata } from "next";
import { FaqList, LearningLoop, MailButton, PageHero, Roster, Row } from "@/components/site/parts";
import { SiteShell } from "@/components/site/SiteShell";
import { agents, byArea } from "@/data/agents";
import { pageMetadata } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Agentes IA",
  description:
    "Agentes de IA que atienden, venden, cobran, facturan y reportan por tu negocio, conectados a WhatsApp y a tus sistemas. Conoce qué hace cada Mc.",
  path: "/agentes",
});

const anatomy = [
  { name: "Un cerebro", text: "Un modelo de IA de última generación con las instrucciones, el tono y los límites de tu negocio." },
  { name: "Tu conocimiento", text: "Catálogo, precios, políticas y respuestas frecuentes, en una base que el Mc consulta antes de contestar." },
  { name: "Conexiones", text: "Se conecta por API con WhatsApp, correo, calendario, CRM, inventario, facturación y pagos." },
  { name: "Coordinación", text: "Flujos en n8n que ordenan cada paso y dejan registro de todo lo que hace." },
  { name: "Una persona al mando", text: "Los casos dudosos pasan a tu equipo. La IA hace lo repetitivo; tú decides." },
];

const faqs = [
  {
    q: "¿Necesito un equipo técnico?",
    a: "No. Nosotros configuramos, conectamos y operamos el Mc; tú nos das la información de tu negocio y apruebas cómo trabaja.",
  },
  {
    q: "¿Con qué sistemas se conecta?",
    a: "Con WhatsApp, correo, redes sociales, calendarios, CRM, ERP, punto de venta y facturación. Si tu sistema tiene API, se puede conectar.",
  },
  {
    q: "¿Qué pasa si el Mc no sabe algo?",
    a: "Está configurado para no inventar: si no tiene la respuesta, pasa el caso a una persona de tu equipo con el resumen de la conversación.",
  },
  {
    q: "¿Funciona por WhatsApp?",
    a: "Sí, con la plataforma oficial de WhatsApp Business. Cada Mc atiende solo los temas de tu negocio, como piden las reglas de WhatsApp.",
  },
];

export default function AgentesPage() {
  return (
    <SiteShell>
      <PageHero title="Agentes IA" subtitle="Un Mc para cada tarea que se repite.">
        <MailButton subject="Agentes IA">Cuéntanos qué quieres automatizar</MailButton>
      </PageHero>

      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <p className="max-w-[36ch] pb-14 font-hero-display text-[clamp(24px,3vw,38px)] leading-[1.15] tracking-[-0.015em] text-pretty md:pb-20">
          Cada agente se especializa en una tarea, se conecta a tus sistemas y trabaja a toda hora con la
          información de tu negocio.
        </p>
        <Roster groups={byArea(agents)} />

        <div className="pt-16 md:pt-24">
          <Row title="Cómo funciona un Mc">
            <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {anatomy.map((part) => (
                <div key={part.name}>
                  <dt className="font-hero-display text-[20px] font-medium tracking-tight">{part.name}</dt>
                  <dd className="mt-2 text-[16px] leading-[1.55] text-[#6e6e73]">{part.text}</dd>
                </div>
              ))}
            </dl>
          </Row>
          <Row title="Aprenden de tu operación">
            <div className="grid gap-10">
              <p className="max-w-[46ch] text-[18px] leading-[1.55] md:text-[20px]">
                Cuando alguien de tu equipo corrige una respuesta, esa corrección se guarda y mejora la
                siguiente. Con el tiempo, cada Mc trabaja más a la medida de tu negocio.
              </p>
              <LearningLoop />
            </div>
          </Row>
          <Row title="Preguntas frecuentes">
            <FaqList faqs={faqs} />
          </Row>
        </div>
      </div>
    </SiteShell>
  );
}
