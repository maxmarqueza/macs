import Link from "next/link";
import type { ReactNode } from "react";
import { AdaptiveIcon } from "@/components/hero/HandsTouchHero";
import { type Faq, type Mc, type McStatus, mcHref, statusLabel } from "@/data/agents";

/**
 * Piezas comunes de las páginas interiores. El elemento distintivo es el anillo
 * de colores del video de la portada (`.mc-ring` en globals.css): cada Mc vive
 * dentro de él, igual que «MACS» en el hero.
 */

export function Ring({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`mc-ring ${className}`} />;
}

export const statusDot: Record<McStatus, string> = {
  disponible: "bg-[#2f9b6d]",
  "en-desarrollo": "bg-[#3f7fd8]",
  proximamente: "bg-[#e0875a]",
};

export function Status({ status, className = "" }: { status: McStatus; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-[13px] text-black/70 ${className}`}>
      <span aria-hidden="true" className={`size-2 rounded-full ${statusDot[status]}`} />
      {statusLabel[status]}
    </span>
  );
}

/**
 * Botón principal: lleva a /contacto con el interés (y el giro) ya elegidos. Todos los
 * contactos del sitio pasan por esa página, así un canal nuevo se agrega en un solo lugar.
 */
export function ContactButton({ interest, giro, children }: { interest?: string; giro?: string; children: ReactNode }) {
  const params = new URLSearchParams();
  if (interest) params.set("interes", interest);
  if (giro) params.set("giro", giro);
  const query = params.toString();
  return (
    <Link
      href={`/contacto${query ? `?${query}` : ""}`}
      className="inline-flex items-center gap-3.5 rounded-full bg-black p-1 pr-6 text-white transition-colors hover:bg-zinc-800"
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-white text-black">
        <AdaptiveIcon />
      </span>
      <span className="text-[13px] font-medium">{children}</span>
    </Link>
  );
}

export function PillLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-full border border-black/15 bg-white px-6 py-3 text-[13px] text-black transition-colors hover:border-black hover:bg-black hover:text-white"
    >
      {children}
    </Link>
  );
}

export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="rounded-full bg-[#F4F4F6] px-4 py-2 text-[14px] text-black/80">
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Lista con viñeta del anillo (cada punto es un pequeño anillo de color). */
export function RingList({ items, large = false }: { items: string[]; large?: boolean }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li
          key={item}
          className={`flex gap-4 ${large ? "text-[18px] md:text-[20px]" : "text-[16px] md:text-[17px]"} leading-[1.45] text-black`}
        >
          <span aria-hidden="true" className="mc-dot mt-[0.55em] shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Fila de ficha: título a la izquierda, contenido a la derecha. */
export function Row({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section
      id={id}
      aria-label={title}
      className="grid gap-5 border-t border-black/10 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12 md:py-14"
    >
      <h2 className="font-hero-display text-[22px] leading-[1.15] font-medium tracking-tight md:text-[26px]">{title}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="border-t border-black/10">
      {faqs.map((faq) => (
        <details key={faq.q} className="group border-b border-black/10">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[17px] leading-snug font-medium [&::-webkit-details-marker]:hidden">
            <span>{faq.q}</span>
            <span
              aria-hidden="true"
              className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#F4F4F6] text-[16px] leading-none transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="max-w-[62ch] pb-6 text-[16px] leading-[1.6] text-[#6e6e73]">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}

/**
 * Catálogo como lista de nombres: cada Mc en una fila con su promesa y su estado,
 * agrupados por área. Es el «roster» de la familia, no una rejilla de tarjetas.
 */
export function Roster({ groups }: { groups: { area: string; items: Mc[] }[] }) {
  return (
    <div className="border-t border-black/10">
      {groups.map((group) => (
        <section
          key={group.area}
          aria-label={group.area}
          className="grid gap-4 border-b border-black/10 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] md:gap-12 md:py-10"
        >
          <h3 className="text-[14px] font-medium text-black/60 md:pt-4">{group.area}</h3>
          <ul>
            {group.items.map((mc) => (
              <li key={mc.slug}>
                <Link
                  href={mcHref(mc)}
                  className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 rounded-2xl py-3 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_auto]"
                >
                  <span className="font-hero-display text-[32px] leading-[1.05] font-medium tracking-[-0.02em] underline-offset-[6px] group-hover:underline md:text-[40px]">
                    {mc.name}
                  </span>
                  <Status status={mc.status} className="justify-self-end md:order-last" />
                  <span className="col-span-2 text-[16px] leading-snug text-[#6e6e73] md:col-span-1">{mc.promise}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Encabezado de página interior: título dentro del anillo, como el hero de la portada. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
  large = false,
  compact = false,
}: {
  eyebrow?: ReactNode;
  title: string;
  subtitle: string;
  children?: ReactNode;
  large?: boolean;
  /** Encabezado bajo para páginas de trabajo (formularios). */
  compact?: boolean;
}) {
  const height = large ? "min-h-[88svh]" : compact ? "min-h-[56svh]" : "min-h-[72svh]";
  // títulos largos (giros) en dos líneas equilibradas y un poco más chicos
  const long = !large && title.length > 20;
  const ring = large ? "w-[min(94vw,72svh,820px)]" : compact ? "w-[min(94vw,42svh,520px)]" : "w-[min(94vw,58svh,680px)]";
  return (
    <section
      className={`relative isolate flex flex-col items-center justify-center overflow-hidden px-6 pt-40 pb-20 text-center ${height}`}
    >
      {/* centrado en el contenido (pt-40 / pb-20 lo bajan 40 px) y siempre dentro de la sección */}
      <Ring className={`top-[calc(50%+40px)] left-1/2 -translate-x-1/2 -translate-y-1/2 ${ring}`} />
      {eyebrow ? <div className="relative text-[13px] text-black/60">{eyebrow}</div> : null}
      <h1
        className={`relative font-hero-display font-medium tracking-[-0.035em] ${
          large
            ? "mt-5 text-[clamp(52px,12vw,164px)] leading-[0.88]"
            : long
              ? "mt-4 max-w-[15ch] text-[clamp(40px,6.4vw,92px)] leading-[0.95] text-balance"
              : "mt-4 text-[clamp(46px,8.5vw,112px)] leading-[0.92]"
        }`}
      >
        {title}
      </h1>
      <p className="relative mt-5 max-w-[24ch] font-hero-display text-[clamp(21px,2.5vw,32px)] leading-[1.12] font-light tracking-tight text-balance text-black/45">
        {subtitle}
      </p>
      {children ? <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">{children}</div> : null}
    </section>
  );
}

/**
 * Ciclo de aprendizaje continuo dibujado sobre el anillo. Con espacio (lg), los
 * cuatro pasos rodean el anillo; en pantallas menores van en lista debajo.
 */
export function LearningLoop() {
  const steps = ["El Mc trabaja", "Tu equipo corrige", "El Mc aprende", "Trabaja mejor"];
  const place = [
    "top-0 left-1/2 -translate-x-1/2",
    "top-1/2 right-0 -translate-y-1/2",
    "bottom-0 left-1/2 -translate-x-1/2",
    "top-1/2 left-0 -translate-y-1/2",
  ];
  const pill =
    "flex items-center gap-2 rounded-full border border-black/10 bg-white py-1.5 pr-4 pl-1.5 text-[14px] whitespace-nowrap text-black";
  const number = "flex size-6 items-center justify-center rounded-full bg-black text-[11px] font-medium text-white";
  return (
    <div className="mx-auto w-full max-w-[460px]">
      <div className="relative mx-auto aspect-square w-full max-w-[300px] lg:max-w-none">
        <Ring className="inset-[6%] lg:inset-[14%]" />
        <p className="absolute inset-0 flex items-center justify-center text-center font-hero-display text-[20px] leading-[1.1] font-medium tracking-tight lg:text-[24px]">
          Aprendizaje
          <br />
          continuo
        </p>
        <ol aria-hidden="true" className="absolute inset-0 hidden lg:block">
          {steps.map((step, index) => (
            <li key={step} className={`absolute ${pill} ${place[index]}`}>
              <span className={number}>{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
      {/* versión legible para lectores de pantalla y pantallas angostas */}
      <ol className="mt-6 flex flex-wrap justify-center gap-2 lg:sr-only">
        {steps.map((step, index) => (
          <li key={step} className={pill}>
            <span className={number}>{index + 1}</span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
