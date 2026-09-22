import { Inter, Outfit } from "next/font/google";
import Link from "next/link";
import { brand, site } from "@/data/site";
import HeroScene from "./HeroScene";

/**
 * Portada: la página de github.com/vikod3/handstouch (src/App.tsx) con su diseño
 * intacto (barra fija, hero, pie de etiquetas, sección «about», video de fondo,
 * degradado y manos fijas, Inter + Outfit, medidas y animaciones) y los textos
 * adaptados a MACS (aprobados por Max el 2026-09-22): la marca «M» en el logo,
 * «inteligencia hecha humana», «Un Mc para cada área», McMarketing y los Mc en
 * camino. Solo se afirma lo documentado en `src/data/agents.ts`. Diferencias de
 * implementación sin efecto visual: `motion` → animaciones CSS con los mismos
 * valores y el icono de `lucide-react` → su SVG.
 */

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hero-inter",
  display: "swap",
});

const outfit = Outfit({
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

/** Equivalente al icono `Plus` de lucide-react (size 13, strokeWidth 3). */
function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={13}
      height={13}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function AdaptiveIcon() {
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

function Navbar() {
  return (
    <nav className="pointer-events-none fixed top-0 left-0 z-50 flex w-full flex-col items-center justify-between gap-4 p-6 animate-hero-nav sm:flex-row md:p-8">
      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3 sm:justify-start">
        <Link href="/" className="flex items-center gap-2">
          <MacsMark />
          <span className="font-hero-display text-[18px] font-medium tracking-tight text-black">
            MACS
          </span>
        </Link>

        <button
          type="button"
          aria-label="Abrir menú"
          className="flex cursor-pointer items-center gap-2.5 rounded-full border border-black/[0.03] bg-black p-1 pr-5 text-[12px] font-medium text-white transition-all duration-200 hover:bg-zinc-800"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
            <PlusIcon />
          </span>
          <span className="pr-1 text-[11.5px]">Menú</span>
        </button>

        <div className="hidden h-11 items-center gap-5 rounded-full border border-black/[0.03] bg-[#F4F4F6] px-6 text-[11.5px] font-normal text-black/60 select-none md:flex">
          <span>Agentes IA</span>
          <span>Automatización</span>
        </div>
      </div>

      <div className="pointer-events-auto flex items-center">
        <a
          href={`mailto:${site.email}`}
          className="flex items-center gap-3.5 rounded-full border border-black/[0.03] bg-[#F4F4F6] p-1 pr-6 transition-colors hover:bg-[#EAEAEF]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
            <AdaptiveIcon />
          </span>
          <span className="text-[11px] font-medium text-black/70 select-none">
            Contacto
          </span>
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <div className="relative z-30 flex min-h-0 flex-1 flex-col items-center justify-center px-6 md:px-12">
      <div className="mt-24 w-full max-w-7xl translate-y-10 px-4 text-center md:mt-0 md:translate-y-14">
        <div className="flex flex-col items-center justify-center select-none animate-hero-rise">
          <h1
            id="hero-title"
            className="font-hero-display text-[7.5vw] leading-[0.9] font-medium tracking-tight text-black md:text-[5.8vw] lg:text-[4.6vw]"
          >
            MACS
          </h1>
          <h2 className="mt-1 font-hero-display text-[7.5vw] leading-[0.9] font-medium tracking-tight md:mt-1.5 md:text-[5.8vw] lg:text-[4.6vw]">
            <span className="mr-1.5 font-light tracking-tight text-black/25 md:mr-2">
              inteligencia
            </span>
            <span className="font-medium tracking-tight text-black">
              hecha humana
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
}

/** Etiquetas del pie: McMarketing enlaza a su ficha; los Mc en camino, al correo. */
const footerTags = [
  { label: "Marketing", href: "/agentes/mcmarketing" },
  { label: "Soporte", href: `mailto:${site.email}?subject=McSoporte` },
  { label: "Ventas", href: `mailto:${site.email}?subject=McVentas` },
] as const;

const tagClass =
  "cursor-pointer rounded-full border border-black/15 bg-white px-6 py-3.5 text-[11.5px] font-normal text-black transition-all duration-300 hover:border-black hover:bg-black hover:text-white active:scale-95";

function Footer() {
  return (
    <footer className="relative z-30 w-full shrink-0 px-8 py-10 md:px-16 md:py-14">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 animate-hero-footer md:flex-row md:items-end">
        <div className="max-w-[300px] md:max-w-[340px]">
          <p className="mb-2 text-[11.5px] font-medium text-black/50">
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

function About() {
  return (
    <section aria-labelledby="about-title" className="about-section">
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

        <div className="about-feature about-movement">
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
          "Marketing",
          "Soporte",
          "Ventas",
          "Datos",
          "Contenido",
          "Automatización",
        ].map((discipline) => (
          <li key={discipline}>{discipline}</li>
        ))}
      </ul>
    </section>
  );
}

export default function HandsTouchHero() {
  return (
    <div
      className={`${inter.variable} ${outfit.variable} handstouch-page w-full bg-white font-hero-sans text-black antialiased selection:bg-black selection:text-white`}
    >
      <Navbar />
      <div aria-hidden="true" className="bottom-gradient" />
      <main>
        <section
          aria-labelledby="hero-title"
          className="relative flex h-screen w-full flex-col justify-between overflow-hidden"
        >
          <HeroScene />
          <Hero />
          <Footer />
        </section>

        <About />
      </main>
    </div>
  );
}
