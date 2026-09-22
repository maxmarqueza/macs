import { Inter, Outfit } from "next/font/google";
import HeroScene from "./HeroScene";

/**
 * Sección hero copiada tal cual de github.com/vikod3/handstouch (src/App.tsx):
 * barra superior, título, pie con etiquetas, video ambiental de fondo y las
 * manos humana y robótica por encima. Textos, tipografías (Inter + Outfit),
 * medidas y animaciones son las del original; solo se sustituyó `motion` por
 * animaciones CSS, `lucide-react` por el SVG equivalente, y `fixed` por
 * `absolute` para que todo viva dentro de la sección.
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

function NeuralMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      fill="currentColor"
      className="h-10 w-10 translate-y-[1px] text-black"
    >
      <rect
        x="7"
        y="19"
        width="15"
        height="5.5"
        rx="2.75"
        transform="rotate(-35 7 19)"
      />
      <rect
        x="17.5"
        y="24"
        width="15"
        height="5.5"
        rx="2.75"
        transform="rotate(-35 17.5 24)"
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
    <nav className="pointer-events-none absolute top-0 left-0 z-50 flex w-full flex-col items-center justify-between gap-4 p-6 motion-safe:animate-hero-nav sm:flex-row md:p-8">
      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3 sm:justify-start">
        <div className="flex items-center gap-1">
          <NeuralMark />
          <span className="font-hero-display text-[18px] font-medium tracking-tight text-black">
            NeuralKinetics
          </span>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          className="flex cursor-pointer items-center gap-2.5 rounded-full border border-black/[0.03] bg-black p-1 pr-5 text-[12px] font-medium text-white transition-all duration-200 hover:bg-zinc-800"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
            <PlusIcon />
          </span>
          <span className="pr-1 text-[11.5px]">Menu</span>
        </button>

        <div className="hidden h-11 items-center gap-5 rounded-full border border-black/[0.03] bg-[#F4F4F6] px-6 text-[11.5px] font-normal text-black/60 select-none md:flex">
          <span>Advanced Bionics</span>
          <span>Cognitive AI</span>
        </div>
      </div>

      <div className="pointer-events-auto flex items-center">
        <button
          type="button"
          className="flex items-center gap-3.5 rounded-full border border-black/[0.03] bg-[#F4F4F6] p-1 pr-6 transition-colors hover:bg-[#EAEAEF]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
            <AdaptiveIcon />
          </span>
          <span className="text-[11px] font-medium text-black/70 select-none">
            Adaptive Systems
          </span>
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <div className="relative z-30 flex min-h-0 flex-1 flex-col items-center justify-center px-6 md:px-12">
      <div className="mt-24 w-full max-w-7xl translate-y-10 px-4 text-center md:mt-0 md:translate-y-14">
        <div className="flex flex-col items-center justify-center select-none motion-safe:animate-hero-rise">
          <h1
            id="hero-title"
            className="font-hero-display text-[7.5vw] leading-[0.9] font-medium tracking-tight text-black md:text-[5.8vw] lg:text-[4.6vw]"
          >
            NeuralKinetics
          </h1>
          <h2 className="mt-1 font-hero-display text-[7.5vw] leading-[0.9] font-medium tracking-tight md:mt-1.5 md:text-[5.8vw] lg:text-[4.6vw]">
            <span className="mr-1.5 font-light tracking-tight text-black/25 md:mr-2">
              cybernetics
            </span>
            <span className="font-medium tracking-tight text-black">
              made organic
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative z-30 w-full shrink-0 px-8 py-10 md:px-16 md:py-14">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 motion-safe:animate-hero-footer md:flex-row md:items-end">
        <div className="max-w-[300px] md:max-w-[340px]">
          <p className="mb-2 text-[11.5px] font-medium text-black/50">
            Autonomous Dynamics
          </p>
          <p className="text-[19px] leading-[1.15] font-normal tracking-tight text-black md:text-[21px]">
            Unifying biological grace with machine intelligence to design the
            next era of fusion
          </p>
        </div>

        <div className="hidden h-16 w-px bg-black/[0.08] lg:block" />

        <div className="flex flex-wrap gap-2.5">
          {["Neuromorphic", "AGI", "Cybernetics"].map((tag) => (
            <button
              key={tag}
              type="button"
              className="cursor-pointer rounded-full border border-black/15 bg-white px-6 py-3.5 text-[11.5px] font-normal text-black transition-all duration-300 hover:border-black hover:bg-black hover:text-white active:scale-95"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function HandsTouchHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className={`${inter.variable} ${outfit.variable} relative flex h-screen w-full flex-col justify-between overflow-hidden bg-white font-hero-sans text-black antialiased selection:bg-black selection:text-white`}
    >
      <Navbar />
      <HeroScene />
      <Hero />
      <Footer />
    </section>
  );
}
