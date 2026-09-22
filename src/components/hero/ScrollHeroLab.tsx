"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { HandRenderer } from "./hand-renderer";
import { About, Footer, Hero, Navbar, inter, outfit } from "./HandsTouchHero";

/**
 * Vista previa: el acercamiento de las manos lo controla el scroll. Tres
 * variantes sobre el mismo diseño de handstouch:
 *  - A «Directo»: el scroll mueve las manos 1:1, sin más efectos.
 *  - B «Parallax»: mismo control, con suavizado e inercia, y las capas se
 *    mueven a distinta velocidad (fondo, título, pie, manos).
 *  - C «Ciclo»: como B; tras el toque, al entrar la segunda pantalla, las manos
 *    se separan y dejan libre el contenido.
 * Usa `public/media/lab/hands-scrub-*.mp4` (todos los cuadros son clave, para
 * que cada búsqueda sea inmediata).
 */

export type Variant = "a" | "b" | "c";

const TOUCH_TIME = 5.2; // s: dedos en contacto
const RELEASE_TIME = 11.0; // s: manos de vuelta en reposo

type Config = {
  label: string;
  summary: string;
  pinVh: number; // alto del recorrido de scroll durante el hero
  eased: boolean; // suavizado + inercia
  parallax: boolean;
  release: boolean; // separación al entrar la segunda pantalla
};

const CONFIGS: Record<Variant, Config> = {
  a: { label: "A · Directo", summary: "El scroll mueve las manos 1:1, sin efectos.", pinVh: 200, eased: false, parallax: false, release: false },
  b: { label: "B · Parallax", summary: "Con inercia y capas a distinta velocidad.", pinVh: 260, eased: true, parallax: true, release: false },
  c: { label: "C · Ciclo", summary: "Como B; al entrar la segunda pantalla, se separan.", pinVh: 260, eased: true, parallax: true, release: true },
};

const smoothstep = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

const HANDS_TIERS: readonly (readonly [number, string])[] = [
  [1920, "/media/lab/hands-scrub-1920.mp4"],
  [Infinity, "/media/lab/hands-scrub-3072.mp4"],
];
const BACKDROP_TIERS: readonly (readonly [number, string])[] = [
  [1920, "/media/background-1920.mp4"],
  [Infinity, "/media/background-3840.mp4"],
];
const pick = (needed: number, tiers: readonly (readonly [number, string])[]) =>
  (tiers.find(([max]) => needed <= max) ?? tiers[tiers.length - 1])[1];

export default function ScrollHeroLab() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const param = searchParams.get("v");
  const variant: Variant = param === "a" || param === "b" || param === "c" ? param : "b";
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
          rendererRef.current = createHandRenderer(canvas, source, setReady, { scrub: true });
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
    let current = 0; // progreso suavizado (0..1) de la fase de acercamiento
    let currentRelease = 0;
    let lastFrameTime = -1;
    let lastNow = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Inercia independiente de los fps (60 o 120 Hz): constante de tiempo ~110 ms.
    const SMOOTH_MS = 110;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(100, now - lastNow);
      lastNow = now;
      const k = 1 - Math.exp(-dt / SMOOTH_MS);
      const cfg = CONFIGS[variantRef.current];
      const pin = pinRef.current;
      if (!pin) return;
      const vh = window.innerHeight;
      const rect = pin.getBoundingClientRect();
      const range = Math.max(1, rect.height - vh);
      const raw = Math.min(1, Math.max(0, -rect.top / range));
      const target = cfg.eased ? smoothstep(raw) : raw;
      current = cfg.eased && !reduced ? current + (target - current) * k : target;
      if (Math.abs(target - current) < 0.0005) current = target;
      // Fase 2 (solo C): separación mientras entra la segunda pantalla.
      const rawRelease = cfg.release ? Math.min(1, Math.max(0, (-rect.top - range) / vh)) : 0;
      const targetRelease = smoothstep(rawRelease);
      currentRelease = reduced ? targetRelease : currentRelease + (targetRelease - currentRelease) * k;
      if (Math.abs(targetRelease - currentRelease) < 0.0005) currentRelease = targetRelease;

      const time = cfg.release && currentRelease > 0
        ? TOUCH_TIME + currentRelease * (RELEASE_TIME - TOUCH_TIME)
        : current * TOUCH_TIME;
      if (Math.abs(time - lastFrameTime) >= 1 / 48) {
        lastFrameTime = time;
        rendererRef.current?.seek(time);
      }

      const p = cfg.parallax ? current : 0;
      const bg = backdropWrapRef.current;
      const hands = handsRef.current;
      const title = titleRef.current;
      const footer = footerRef.current;
      if (bg) bg.style.transform = `translate3d(0, ${-8 * p}vh, 0) scale(${1 + 0.06 * p})`;
      if (hands) hands.style.transform = `translate3d(0, ${-5 * p}vh, 0)`;
      if (title) {
        title.style.transform = `translate3d(0, ${-12 * p}vh, 0)`;
        title.style.opacity = String(1 - 0.75 * p);
      }
      if (footer) {
        footer.style.transform = `translate3d(0, ${-4 * p}vh, 0)`;
        footer.style.opacity = String(1 - p);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const choose = (v: Variant) => {
    router.replace(`/lab/scroll?v=${v}`, { scroll: false });
    window.scrollTo({ top: 0 });
  };

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

      {/* Manos fijas (z 60), controladas por el scroll. */}
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

      {/* Selector de variante (solo en esta vista previa). */}
      <div className="pointer-events-auto fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 flex-col items-center gap-2">
        <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white/90 p-1 shadow-lg backdrop-blur">
          {(Object.keys(CONFIGS) as Variant[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => choose(v)}
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
    </div>
  );
}
