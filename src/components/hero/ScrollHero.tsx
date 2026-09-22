"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { HandRenderer } from "./hand-renderer";
import { About, Footer, Hero, Navbar, inter, outfit } from "./HandsTouchHero";

/**
 * Portada con el acercamiento de las manos controlado por el scroll, sobre el
 * diseño de handstouch: empieza con las manos en reposo y, conforme se baja,
 * se acercan hasta tocarse; el hero queda fijo mientras dura el recorrido y
 * después entra la segunda pantalla.
 *
 * Variantes (la portada usa «b», la elegida por Max; `/lab/scroll` permite
 * comparar con «a»):
 *  - a «Directo»: el scroll mueve las manos 1:1, sin más efectos.
 *  - b «Parallax»: inercia de resorte y capas a distinta velocidad (fondo,
 *    título, pie, manos); el toque se sostiene un momento antes de soltar.
 *
 * El video de scroll (`public/media/hands-scroll-*.mp4`) cubre del reposo al
 * toque (0 → 5.2 s del original) interpolado a 48 fps con compensación de
 * movimiento (250 cuadros, pasos de ~2 px en pantalla), con todos los cuadros
 * clave y compresión casi sin pérdida, porque cada cuadro se ve quieto.
 */

export type Variant = "a" | "b";

const SCROLL_FPS = 48;
const SCROLL_FRAMES = 250;
const TOUCH_TIME = (SCROLL_FRAMES - 1) / SCROLL_FPS; // último cuadro: dedos en contacto

type Config = {
  label: string;
  summary: string;
  pinVh: number; // alto del recorrido de scroll del hero
  holdEnd: number; // fracción final del recorrido en que el toque se sostiene
  spring: boolean; // inercia
  parallax: boolean;
};

export const CONFIGS: Record<Variant, Config> = {
  a: { label: "A · Directo", summary: "El scroll mueve las manos 1:1, sin efectos.", pinVh: 200, holdEnd: 0, spring: false, parallax: false },
  b: { label: "B · Parallax", summary: "Inercia de resorte y capas a distinta velocidad.", pinVh: 280, holdEnd: 0.1, spring: true, parallax: true },
};

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smoothstep = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
// Suavizado leve del recorrido: conserva el ritmo natural del metraje y solo
// redondea arranque y llegada.
const easeProgress = (p: number) => 0.5 * p + 0.5 * smoothstep(p);

const HANDS_TIERS: readonly (readonly [number, string])[] = [
  [1920, "/media/hands-scroll-1920.mp4"],
  [3072, "/media/hands-scroll-3072.mp4"],
  [Infinity, "/media/hands-scroll-3840.mp4"],
];
const BACKDROP_TIERS: readonly (readonly [number, string])[] = [
  [1920, "/media/background-1920.mp4"],
  [Infinity, "/media/background-3840.mp4"],
];
const pick = (needed: number, tiers: readonly (readonly [number, string])[]) =>
  (tiers.find(([max]) => needed <= max) ?? tiers[tiers.length - 1])[1];

/** Resorte críticamente amortiguado: llega sin rebote, con arranque y frenado naturales. */
class Spring {
  pos = 0;
  vel = 0;
  constructor(private readonly stiffness: number) {}
  step(target: number, dtSeconds: number) {
    const damping = 2 * Math.sqrt(this.stiffness);
    let remaining = Math.min(0.1, dtSeconds);
    const h = 1 / 240;
    while (remaining > 0) {
      const dt = Math.min(h, remaining);
      const acc = this.stiffness * (target - this.pos) - damping * this.vel;
      this.vel += acc * dt;
      this.pos += this.vel * dt;
      remaining -= dt;
    }
    if (Math.abs(target - this.pos) < 0.0004 && Math.abs(this.vel) < 0.004) {
      this.pos = target;
      this.vel = 0;
    }
    return this.pos;
  }
}

type Props = {
  variant?: Variant;
  /** Si se pasa, muestra el selector de variantes (vista previa). */
  onVariantChange?: (v: Variant) => void;
};

export default function ScrollHero({ variant = "b", onVariantChange }: Props) {
  const [ready, setReady] = useState(false);
  const backdropRef = useRef<HTMLVideoElement>(null);
  const backdropWrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<HTMLVideoElement>(null);
  const handsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<HandRenderer | null>(null);
  const variantRef = useRef<Variant>(variant);

  useEffect(() => {
    variantRef.current = variant;
  }, [variant]);

  // Videos + compositor (una sola vez).
  useEffect(() => {
    const backdrop = backdropRef.current;
    const canvas = canvasRef.current;
    const source = sourceRef.current;
    if (!backdrop || !canvas || !source) return;
    let cancelled = false;
    const needed = Math.ceil(window.innerWidth * Math.min(window.devicePixelRatio || 1, 3));
    backdrop.src = pick(needed, BACKDROP_TIERS);
    source.src = pick(needed, HANDS_TIERS);
    backdrop.muted = true;
    const playBackdrop = () => void backdrop.play().catch(() => {});
    playBackdrop();
    window.addEventListener("pointerdown", playBackdrop, { passive: true });
    import("./hand-renderer")
      .then(({ createHandRenderer }) => {
        if (cancelled) return;
        try {
          rendererRef.current = createHandRenderer(canvas, source, setReady, {
            scrub: true,
            frameRate: SCROLL_FPS,
          });
        } catch {
          setReady(false);
        }
      })
      .catch(() => setReady(false));
    return () => {
      cancelled = true;
      rendererRef.current?.dispose();
      rendererRef.current = null;
      window.removeEventListener("pointerdown", playBackdrop);
      backdrop.pause();
    };
  }, []);

  // Bucle de scroll: progreso → cuadro de las manos + parallax.
  useEffect(() => {
    let raf = 0;
    const approach = new Spring(170);
    let lastFrame = -1;
    let lastNow = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = (now - lastNow) / 1000;
      lastNow = now;
      const cfg = CONFIGS[variantRef.current];
      const pin = pinRef.current;
      if (!pin) return;
      const vh = window.innerHeight;
      const rect = pin.getBoundingClientRect();
      const range = Math.max(1, rect.height - vh);
      // Recorrido útil: el tramo final (`holdEnd`) sostiene el toque antes de soltar.
      const raw = clamp01(-rect.top / (range * (1 - cfg.holdEnd)));
      const target = cfg.spring ? easeProgress(raw) : raw;
      const p = cfg.spring && !reduced ? approach.step(target, dt) : target;

      const time = p * TOUCH_TIME;
      const frame = Math.round(time * SCROLL_FPS);
      if (frame !== lastFrame) {
        lastFrame = frame;
        rendererRef.current?.seek(time);
      }

      const q = cfg.parallax ? p : 0;
      const bg = backdropWrapRef.current;
      const hands = handsRef.current;
      const title = titleRef.current;
      const footer = footerRef.current;
      if (bg) bg.style.transform = `translate3d(0, ${(-6 * q).toFixed(3)}vh, 0) scale(${(1 + 0.07 * q).toFixed(4)})`;
      if (hands) hands.style.transform = `translate3d(0, ${(-4 * q).toFixed(3)}vh, 0)`;
      if (title) {
        title.style.transform = `translate3d(0, ${(-9 * q).toFixed(3)}vh, 0)`;
        title.style.opacity = (1 - 0.85 * q * q).toFixed(3);
      }
      if (footer) {
        footer.style.transform = `translate3d(0, ${(-3 * q).toFixed(3)}vh, 0)`;
        footer.style.opacity = (1 - clamp01(q / 0.45)).toFixed(3);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const cfg = CONFIGS[variant];

  return (
    <div
      className={`${inter.variable} ${outfit.variable} handstouch-page w-full bg-white font-hero-sans text-black antialiased selection:bg-black selection:text-white`}
    >
      <Navbar />
      <div aria-hidden="true" className="bottom-gradient" />

      {/* Fondo fijo (z 0); el parallax va en el envoltorio, no en el elemento animado. */}
      <div ref={backdropWrapRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 will-change-transform">
        <div className="pointer-events-none absolute inset-0 select-none animate-hero-backdrop">
          <video
            ref={backdropRef}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
          />
        </div>
      </div>

      {/* Manos fijas (z 60), controladas por el scroll. Solo se trasladan: nunca se reescalan. */}
      <div ref={handsRef} className="hands-overlay will-change-transform" aria-hidden="true">
        <div className="hands-frame" data-ready={ready}>
          <Image
            className="hands-poster"
            src="/media/hands-poster.webp"
            width={3840}
            height={1280}
            sizes="100vw"
            quality={90}
            alt=""
            priority
            draggable={false}
          />
          <canvas ref={canvasRef} className="hands-canvas" />
        </div>
        <video
          ref={sourceRef}
          className="hands-source"
          preload="auto"
          muted
          playsInline
          tabIndex={-1}
          disablePictureInPicture
          disableRemotePlayback
        />
      </div>

      <main>
        {/* Recorrido de scroll del hero: la pantalla queda fija mientras las manos se acercan. */}
        <div ref={pinRef} style={{ height: `${cfg.pinVh}vh` }}>
          <section
            aria-labelledby="hero-title"
            className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden"
          >
            <div ref={titleRef} className="flex min-h-0 flex-1 flex-col will-change-transform">
              <Hero />
            </div>
            <div ref={footerRef} className="will-change-transform">
              <Footer />
            </div>
          </section>
        </div>

        <About />
      </main>

      {onVariantChange && (
        <div className="pointer-events-auto fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 flex-col items-center gap-2">
          <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white/90 p-1 shadow-lg backdrop-blur">
            {(Object.keys(CONFIGS) as Variant[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onVariantChange(v)}
                className={`cursor-pointer rounded-full px-4 py-2 text-[12px] font-medium transition-colors ${
                  v === variant ? "bg-black text-white" : "text-black/70 hover:bg-black/5"
                }`}
              >
                {CONFIGS[v].label}
              </button>
            ))}
          </div>
          <p className="rounded-full bg-white/80 px-3 py-1 text-[11px] text-black/60 backdrop-blur">
            Vista previa · {cfg.summary} Haz scroll.
          </p>
        </div>
      )}
    </div>
  );
}
