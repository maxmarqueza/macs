import type { Metadata } from "next";
import { FaqList, LearningLoop, MailButton, PageHero, Row } from "@/components/site/parts";
import { SiteShell } from "@/components/site/SiteShell";
import { workSteps } from "@/data/agents";
import { pageMetadata } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Cómo trabajamos",
  description:
    "Diagnóstico, piloto, operación y mejora continua: así ponemos a trabajar un Mc en tu negocio, cómo cobramos y qué nos comprometemos a cuidar.",
  path: "/como-trabajamos",
});

const pricing = [
  {
    name: "Agentes IA",
    text: "Un pago de implementación para configurar y conectar el Mc, y una mensualidad que incluye su operación, los costos de IA y de mensajería, el monitoreo y las mejoras. El precio depende del volumen y de las conexiones; lo definimos juntos después del diagnóstico.",
  },
  {
    name: "Robots con IA",
    text: "Compra o renta mensual. En los dos casos incluye instalación, capacitación, mantenimiento y la capa de IA de MACS que conecta el robot con tu operación.",
  },
];

const commitments = [
  {
    name: "Una persona al mando",
    text: "El Mc hace lo repetitivo. Las decisiones importantes y los casos delicados siempre pasan a tu equipo.",
  },
  {
    name: "Tus datos son tuyos",
    text: "Firmamos un contrato de tratamiento de datos, usamos solo la información necesaria y te ayudamos a tener tu aviso de privacidad al día.",
  },
  {
    name: "Resultados que se miden",
    text: "Cada Mc tiene métricas acordadas desde el diagnóstico y cada mes te decimos cómo van.",
  },
  {
    name: "Canales oficiales",
    text: "Los Mc usan las plataformas oficiales, como WhatsApp Business, y respetan sus reglas.",
  },
];

const faqs = [
  {
    q: "¿Cómo empiezo?",
    a: "Escríbenos con lo que quieres automatizar. Agendamos un diagnóstico para entender tu operación y proponerte por dónde empezar.",
  },
  {
    q: "¿Cuánto tarda en estar listo un Mc?",
    a: "Depende del Mc y de los sistemas que haya que conectar. En el diagnóstico te damos un plan con fechas concretas.",
  },
  {
    q: "¿Puedo empezar con un solo Mc?",
    a: "Sí, y es lo que recomendamos: uno que resuelva lo más urgente. Cuando funciona, sumamos el siguiente.",
  },
];

export default function ComoTrabajamosPage() {
  return (
    <SiteShell>
      <PageHero title="Cómo trabajamos" subtitle="Primero entendemos tu negocio. Después lo automatizamos.">
        <MailButton subject="Diagnóstico">Agenda un diagnóstico</MailButton>
      </PageHero>

      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <ol className="border-t border-black/10">
          {workSteps.map((step, index) => (
            <li
              key={step.name}
              className="grid gap-3 border-b border-black/10 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12 md:py-14"
            >
              <div className="flex items-baseline gap-5">
                <span className="font-hero-display text-[15px] font-medium text-black/40 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="font-hero-display text-[34px] leading-none font-medium tracking-[-0.02em] md:text-[44px]">
                  {step.name}
                </h2>
              </div>
              <p className="max-w-[48ch] text-[18px] leading-[1.55] md:pt-2 md:text-[20px]">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="pt-16 md:pt-24">
          <Row title="Cada corrección lo hace mejor">
            <div className="grid gap-10">
              <p className="max-w-[46ch] text-[18px] leading-[1.55] md:text-[20px]">
                Todos los Mc aprenden de tu operación. Una respuesta corregida, un defecto confirmado o una
                ruta ajustada se guardan y mejoran el siguiente resultado.
              </p>
              <LearningLoop />
            </div>
          </Row>
          <Row title="Cómo cobramos">
            <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {pricing.map((item) => (
                <div key={item.name}>
                  <dt className="font-hero-display text-[20px] font-medium tracking-tight">{item.name}</dt>
                  <dd className="mt-2 text-[16px] leading-[1.55] text-[#6e6e73]">{item.text}</dd>
                </div>
              ))}
            </dl>
          </Row>
          <Row title="Lo que cuidamos">
            <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {commitments.map((item) => (
                <div key={item.name}>
                  <dt className="font-hero-display text-[20px] font-medium tracking-tight">{item.name}</dt>
                  <dd className="mt-2 text-[16px] leading-[1.55] text-[#6e6e73]">{item.text}</dd>
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
