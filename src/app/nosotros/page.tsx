import type { Metadata } from "next";
import Link from "next/link";
import { ContactButton, PageHero, Row } from "@/components/site/parts";
import { SiteShell } from "@/components/site/SiteShell";
import { agents, robots } from "@/data/agents";
import { pageMetadata } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Nosotros",
  description:
    "MACS existe para que cualquier negocio en México automatice su operación con inteligencia artificial, sin contratar un equipo técnico. Inteligencia hecha humana.",
  path: "/nosotros",
  ownImage: true,
});

const beliefs = [
  {
    name: "La IA hace lo repetitivo",
    text: "Las personas deciden. Cada Mc pasa a tu equipo lo que requiere criterio, trato humano o una decisión importante.",
  },
  {
    name: "Empezar pequeño y medir",
    text: "Primero un Mc que resuelva lo más urgente, con métricas claras. Cuando funciona, sumamos el siguiente.",
  },
  {
    name: "Cada negocio es distinto",
    text: "Partimos de una plantilla para tu giro y la ajustamos a tu operación, tus sistemas y tu tono.",
  },
  {
    name: "Tecnología con reglas claras",
    text: "Canales oficiales, contratos de tratamiento de datos y transparencia con tus clientes sobre cuándo hablan con un agente de IA.",
  },
];

export default function NosotrosPage() {
  const lines = [
    { name: "Agentes IA", href: "/agentes", text: `${agents.length} agentes que atienden, venden, cobran, facturan y reportan por tu negocio.` },
    { name: "Robots con IA", href: "/robots", text: `${robots.length} robots de servicio e industriales con la misma inteligencia.` },
    { name: "Aprendizaje continuo", href: "/como-trabajamos", text: "Cada corrección de tu equipo mejora a cada Mc." },
  ];
  return (
    <SiteShell>
      <PageHero title="Nosotros" subtitle="Inteligencia hecha humana.">
        <ContactButton>Hablemos</ContactButton>
      </PageHero>

      <div className="mx-auto max-w-6xl px-6 pb-6 md:px-12">
        <p className="max-w-[34ch] pb-14 font-hero-display text-[clamp(24px,3vw,38px)] leading-[1.15] tracking-[-0.015em] text-pretty md:pb-20">
          MACS existe para que cualquier negocio en México pueda automatizar su operación con inteligencia
          artificial, sin contratar un equipo técnico.
        </p>

        <Row title="Qué significa MACS">
          <p className="max-w-[54ch] text-[18px] leading-[1.55] md:text-[20px]">
            MACS significa muchos Mc. Cada Mc es un especialista con nombre propio: un agente de IA que trabaja en
            tus sistemas o un robot que trabaja en tu espacio. Juntos forman una familia que crece con tu negocio.
          </p>
        </Row>

        <Row title="Lo que hacemos">
          <ul className="border-t border-black/10">
            {lines.map((line) => (
              <li key={line.name} className="border-b border-black/10">
                <Link href={line.href} className="group grid gap-x-6 gap-y-1 py-5 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:items-baseline">
                  <span className="font-hero-display text-[26px] leading-tight font-medium tracking-[-0.02em] underline-offset-[6px] group-hover:underline">
                    {line.name}
                  </span>
                  <span className="text-[16px] leading-snug text-[#6e6e73]">{line.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Row>

        <Row title="En qué creemos">
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {beliefs.map((belief) => (
              <div key={belief.name}>
                <dt className="font-hero-display text-[20px] font-medium tracking-tight">{belief.name}</dt>
                <dd className="mt-2 text-[16px] leading-[1.55] text-[#6e6e73]">{belief.text}</dd>
              </div>
            ))}
          </dl>
        </Row>

        <Row title="Hecho para México">
          <p className="max-w-[54ch] text-[18px] leading-[1.55] md:text-[20px]">
            Trabajamos con negocios en México y para la forma en que aquí se hacen negocios: WhatsApp como canal
            principal, facturación CFDI y los sistemas que ya usas.
          </p>
        </Row>
      </div>
    </SiteShell>
  );
}
