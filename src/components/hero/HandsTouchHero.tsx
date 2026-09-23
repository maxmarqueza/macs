import { Inter, Outfit } from "next/font/google";
import Link from "next/link";
import { agents, mcHref, robots } from "@/data/agents";
import { brand, site } from "@/data/site";
import { solutions } from "@/data/solutions";
import NavLinks from "@/components/site/NavLinks";
import MenuButton from "./MenuButton";

/**
 * Piezas de la portada, copiadas del diseño de github.com/vikod3/handstouch
 * (src/App.tsx) con los textos de MACS aprobados por Max el 2026-09-22: barra
 * fija con la marca «M», hero «inteligencia hecha humana», pie de etiquetas y
 * sección «Un Mc para cada área». Las usa `ScrollHero.tsx`, que añade el video
 * de fondo y las manos controladas por el scroll. Solo se afirma lo documentado
 * en `src/data/agents.ts`. El icono de `lucide-react` del original es su SVG.
 */

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hero-inter",
  display: "swap",
});

export const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hero-outfit",
  display: "swap",
});

/** Marca de MACS (la misma «M» de src/app/icon.svg), en el lugar del logo del original. */
function MacsMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className="h-8 w-8">
      <defs>
        <radialGradient id="macs-mark-glow" cx="50%" cy="0%" r="75%">
          <stop offset="0" stopColor={brand.accent} stopOpacity="0.35" />
          <stop offset="1" stopColor={brand.accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill={brand.background} />
      <rect width="64" height="64" rx="14" fill="url(#macs-mark-glow)" />
      <path
        d="M16 48V16l16 20 16-20v32"
        fill="none"
        stroke={brand.accent}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AdaptiveIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="12" cy="5" r="2.3" fill="currentColor" />
      <circle cx="19" cy="12" r="2.3" fill="currentColor" />
      <circle cx="12" cy="19" r="2.3" fill="currentColor" />
      <circle cx="5" cy="12" r="2.3" fill="currentColor" />
      <circle cx="12" cy="12" r="2.7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function Navbar() {
  return (
    <nav className="pointer-events-none fixed top-0 left-0 z-50 flex w-full flex-col items-center justify-between gap-4 p-6 animate-hero-nav sm:flex-row md:p-8">
      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3 sm:justify-start">
        <Link href="/" className="flex items-center gap-2">
          <MacsMark />
          <span className="font-hero-display text-[18px] font-medium tracking-tight text-black">
            MACS
          </span>
        </Link>

        <MenuButton />

        <NavLinks />
      </div>

      <div className="pointer-events-auto flex items-center">
        <Link
          href="/contacto"
          className="flex items-center gap-3.5 rounded-full border border-black/[0.03] bg-[#F4F4F6] p-1 pr-6 transition-colors hover:bg-[#EAEAEF]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
            <AdaptiveIcon />
          </span>
          <span className="text-[11px] font-medium text-black/70 select-none">
            Contacto
          </span>
        </Link>
      </div>
    </nav>
  );
}

export function Hero() {
  return (
    <div className="relative z-30 flex min-h-0 flex-1 flex-col items-center justify-center px-6 md:px-12">
      <div className="mt-24 w-full max-w-7xl translate-y-10 px-4 text-center md:mt-0 md:translate-y-14">
        <div className="flex flex-col items-center justify-center animate-hero-rise">
          <h1
            id="hero-title"
            className="font-hero-display flex flex-col items-center text-[7.5vw] leading-[0.9] font-medium tracking-tight text-black md:text-[5.8vw] lg:text-[4.6vw]"
          >
            <span className="block">MACS</span>
            <span className="mt-1 block md:mt-1.5">
              <span className="mr-1.5 font-light tracking-tight text-black/40 md:mr-2">
                inteligencia
              </span>
              <span className="font-medium tracking-tight text-black">
                hecha humana
              </span>
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}

/** Etiquetas del pie del hero: cada una lleva a la ficha de su Mc. */
const footerTags = [
  { label: "Marketing", href: "/agentes/mcmarketing" },
  { label: "Soporte", href: "/agentes/mcsoporte" },
  { label: "Ventas", href: "/agentes/mcventas" },
] as const;

const tagClass =
  "cursor-pointer rounded-full border border-black/15 bg-white px-6 py-3.5 text-[11.5px] font-normal text-black transition-all duration-300 hover:border-black hover:bg-black hover:text-white active:scale-95";

export function Footer() {
  return (
    <footer className="relative z-30 w-full shrink-0 px-8 py-10 md:px-16 md:py-14">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 animate-hero-footer md:flex-row md:items-end">
        <div className="max-w-[300px] md:max-w-[340px]">
          <p className="mb-2 text-[11.5px] font-medium text-black/60">
            {site.tagline}
          </p>
          <p className="text-[19px] leading-[1.15] font-normal tracking-tight text-black md:text-[21px]">
            Cada Mc es un agente de inteligencia artificial que automatiza una
            parte de tu negocio, para que tú te concentres en hacerlo crecer.
          </p>
        </div>

        <div className="hidden h-16 w-px bg-black/[0.08] lg:block" />

        <div className="flex flex-wrap gap-2.5">
          {footerTags.map((tag) =>
            tag.href.startsWith("/") ? (
              <Link key={tag.label} href={tag.href} className={tagClass}>
                {tag.label}
              </Link>
            ) : (
              <a key={tag.label} href={tag.href} className={tagClass}>
                {tag.label}
              </a>
            ),
          )}
        </div>
      </div>
    </footer>
  );
}

export function About() {
  return (
    <section id="agentes" aria-labelledby="about-title" className="about-section">
      <div className="about-grid">
        <div className="about-headline">
          <h2 id="about-title">
            <span>Un Mc para</span>
            <span>cada área</span>
          </h2>
          <p className="about-intro">
            Marketing, soporte, ventas y datos. Cada Mc domina una especialidad
            y trabaja para ti las 24 horas.
          </p>
        </div>

        <div className="about-feature about-cognition">
          <p className="about-overline">01 / McMarketing</p>
          <h3>
            <Link
              href="/agentes/mcmarketing"
              className="underline-offset-8 hover:underline"
            >
              Publica.
              <br />
              Responde.
              <br />
              Conversa.
            </Link>
          </h3>
          <p className="about-detail">
            Publica contenido todos los días en tus redes, responde comentarios y
            contesta mensajes directos.
          </p>
        </div>

        <div className="about-bio">
          <p className="about-overline">El lado humano de la automatización</p>
          <p>
            Detrás de cada Mc hay personas que entienden tu negocio. La IA hace
            lo repetitivo; tú tomas las decisiones.
          </p>
        </div>

        <div id="proximos" className="about-feature about-movement">
          <p className="about-overline">02 / Próximos Mc</p>
          <h3>
            Soporte.
            <br />
            Ventas.
            <br />
            Datos.
          </h3>
          <p className="about-detail">
            McSoporte, McVentas y McDatos vienen en camino: atención 24/7,
            seguimiento de prospectos y reportes automáticos.
          </p>
        </div>
      </div>

      <ul className="about-disciplines" aria-label="Nuestras áreas">
        {[
          "Ventas",
          "Atención",
          "Marketing",
          "Administración",
          "Datos",
          "Robots",
        ].map((discipline) => (
          <li key={discipline}>{discipline}</li>
        ))}
      </ul>
    </section>
  );
}

/** Cierre del sitio: llamada a contacto, mapa del sitio y línea legal. */
export function SiteFooter({ cta = true }: { cta?: boolean }) {
  const columns = [
    { title: "Agentes IA", links: agents.map((mc) => ({ label: mc.name, href: mcHref(mc) })) },
    { title: "Robots con IA", links: robots.map((mc) => ({ label: mc.name, href: mcHref(mc) })) },
    { title: "Soluciones por giro", links: solutions.map((s) => ({ label: s.name, href: `/soluciones/${s.slug}` })) },
    {
      title: "MACS",
      links: [
        { label: "Cómo trabajamos", href: "/como-trabajamos" },
        { label: "Nosotros", href: "/nosotros" },
        { label: "Contacto", href: "/contacto" },
        { label: "Aviso de privacidad", href: "/privacidad" },
        { label: "Términos de uso", href: "/terminos" },
      ],
    },
  ];
  return (
    <footer id="contacto" className="relative z-10 w-full bg-white px-6 pt-16 pb-10 md:px-16 md:pt-24 md:pb-12">
      {cta ? (
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-[560px]">
          <p className="mb-3 text-[11.5px] font-medium text-black/60">Contacto</p>
          <h2 className="font-hero-display text-[34px] leading-[1.05] font-medium tracking-tight md:text-[46px]">
            ¿Qué parte de tu negocio automatizamos primero?
          </h2>
          <p className="mt-4 max-w-[440px] text-[16px] leading-[1.5] text-[#6e6e73]">
            Cuéntanos qué necesitas y te decimos qué Mc lo resuelve.
          </p>
        </div>
        <Link
          href="/contacto"
          className="flex items-center gap-3.5 rounded-full border border-black/[0.03] bg-black p-1 pr-6 text-white transition-colors hover:bg-zinc-800"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
            <AdaptiveIcon />
          </span>
          <span className="text-[13px] font-medium">Escríbenos</span>
        </Link>
      </div>
      ) : null}

      <nav
        aria-label="Mapa del sitio"
        className={`mx-auto grid ${cta ? "mt-16" : ""} max-w-7xl grid-cols-2 gap-x-8 gap-y-10 border-t border-black/10 pt-12 lg:grid-cols-4`}
      >
        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="text-[13px] font-medium text-black/50">{column.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[15px] text-black/80 underline-offset-4 hover:text-black hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mx-auto mt-14 flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-black/10 pt-6 text-[12px] text-black/60">
        <span>© {new Date().getFullYear()} MACS, macstech.mx</span>
        <span>Inteligencia hecha humana</span>
      </div>
    </footer>
  );
}
