"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  BACKDROP_SRC,
  HANDS_FPS,
  HANDS_FRAMES,
  POSTER_SRC,
  neededWidth,
  pickHandsTier,
} from "@/data/media";
import Halion from "@/components/halion/Halion";
import { acquireScroll, releaseScroll } from "@/components/halion/scroll";
import type { HandRenderer } from "./hand-renderer";
import { About, Footer, Hero, Navbar, SiteFooter, inter, outfit } from "./HandsTouchHero";

/**
 * Portada: el acercamiento de las manos lo controla el scroll, sobre el diseño
 * de handstouch. Empieza con las manos en reposo y, conforme se baja, se acercan
 * hasta tocarse (cuadro 144 del clip); el hero queda fijo mientras dura el
 * recorrido, el toque se sostiene un momento y después entra la segunda
 * pantalla, con la que las manos se van.
 *
 * Movimiento: progreso de scroll → curva que compensa el frenado natural del
 * metraje → cuadro del video. El desplazamiento lo suaviza Lenis (dueño del
 * scroll de toda la portada, ver components/halion/scroll.ts), así que el mapeo
 * es directo; el resorte propio solo se usa si Lenis no está activo. Parallax
 * por capas: fondo, título, pie y manos. Todo se desactiva con
 * `prefers-reduced-motion` salvo el scrub.
 *
 * Secciones de la portada, una tras otra y sin transición entre ellas: (1) Halion,
 * clon literal que abre la página; (2) este hero de las manos; (3) «Un Mc para cada
 * área» y pie de MACS. Cada sección muestra solo su propia cabecera. Las capas fijas
 * del hero (fondo y manos) se desplazan con su sección mientras esta entra desde abajo,
 * así nunca aparecen sobre Halion.
 *
 * Carga: el video del nivel elegido se descarga completo con `fetch` (barra de
 * progreso discreta) y se asigna como Blob, así cada búsqueda es local y nunca
 * espera a la red. Mientras llega, el póster (cuadro 0) queda quieto y las manos
 * alcanzan la posición del scroll en cuanto hay datos.
 */

const TOUCH_TIME = (HANDS_FRAMES - 1) / HANDS_FPS; // último cuadro: dedos en contacto
const PIN_VH = 280; // recorrido de scroll del hero
const HEADER_SWAP_PX = 72; // relevo de cabeceras: línea (alto de la barra) donde cambia la sección
const HOLD_END = 0.06; // fracción final del recorrido en que el toque se sostiene
const STIFFNESS = 900; // resorte con puntero fino: asienta en ~0.15 s, sin rebote

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smoothstep = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
/** El metraje ya frena solo al final; esta curva lo compensa para que el avance por scroll sea uniforme. */
const easeProgress = (p: number) => 0.65 * p + 0.35 * p * p;

/** Resorte críticamente amortiguado: llega sin rebote, con arranque y frenado naturales. */
class Spring {
  pos = 0;
  vel = 0;
  constructor(private readonly stiffness: number) {}
  init(pos: number) {
    this.pos = pos;
    this.vel = 0;
  }
  settled(target: number) {
    return this.pos === target && this.vel === 0;
  }
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

type NetworkInformation = { saveData?: boolean };

/** Descarga completa con progreso; devuelve una URL de Blob local. */
async function fetchAsObjectUrl(
  url: string,
  signal: AbortSignal,
  onProgress: (fraction: number) => void,
) {
  const response = await fetch(url, { signal, priority: "high" } as RequestInit);
  if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);
  const total = Number(response.headers.get("content-length")) || 0;
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  let lastReported = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    const fraction = total ? received / total : 0;
    if (fraction - lastReported >= 0.02) {
      lastReported = fraction;
      onProgress(fraction);
    }
  }
  onProgress(1);
  return URL.createObjectURL(new Blob(chunks as BlobPart[], { type: "video/mp4" }));
}

export default function ScrollHero() {
  const [ready, setReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLVideoElement>(null);
  const backdropWrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<HTMLVideoElement>(null);
  const handsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const rendererRef = useRef<HandRenderer | null>(null);
  const timeRef = useRef(0);
  const navWrapRef = useRef<HTMLDivElement>(null);
  const halionRef = useRef<HTMLDivElement>(null);
  const backdropCoveredRef = useRef(false);
  const syncBackdropRef = useRef<() => void>(() => {});

  // Videos + compositor (una sola vez).
  useEffect(() => {
    const root = rootRef.current;
    const backdrop = backdropRef.current;
    const canvas = canvasRef.current;
    const source = sourceRef.current;
    if (!root || !backdrop || !canvas || !source) return;
    let cancelled = false;
    let objectUrl: string | undefined;
    const controller = new AbortController();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const showProgress = (fraction: number) => {
      const bar = progressRef.current;
      if (!bar) return;
      bar.style.width = `${Math.round(fraction * 100)}%`;
      bar.style.opacity = fraction >= 1 ? "0" : "1";
    };

    // Si la página abre ya desplazada (recarga, volver atrás), sin animaciones de entrada.
    root.dataset.entrance = window.scrollY > 8 ? "skip" : "play";

    // Fondo ambiental: pausado con «reducir movimiento» o pestaña oculta; si el
    // navegador bloquea la reproducción automática, el primer gesto la reanuda.
    backdrop.src = BACKDROP_SRC;
    backdrop.muted = true;
    const syncBackdrop = () => {
      if (reduced.matches || document.hidden || backdropCoveredRef.current) backdrop.pause();
      else void backdrop.play().catch(() => {});
    };
    syncBackdropRef.current = syncBackdrop;
    syncBackdrop();
    document.addEventListener("visibilitychange", syncBackdrop);
    reduced.addEventListener("change", syncBackdrop);
    const gestures = ["touchend", "click", "keydown"] as const;
    gestures.forEach((g) => window.addEventListener(g, syncBackdrop, { passive: true }));

    // Manos: solo el póster si el usuario pidió ahorrar datos. (No se usa
    // `effectiveType`: es una estimación que Chrome da mal con frecuencia.)
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const lowData = connection?.saveData === true;
    if (!lowData) {
      const url = pickHandsTier(neededWidth(window.innerWidth, window.devicePixelRatio));
      fetchAsObjectUrl(url, controller.signal, (f) => {
        if (!cancelled) showProgress(f);
      })
        .then((blobUrl) => {
          if (cancelled) {
            URL.revokeObjectURL(blobUrl);
            return;
          }
          objectUrl = blobUrl;
          source.src = blobUrl;
        })
        .catch(() => {
          // Sin Blob (fallo de red o de memoria): el navegador carga por rangos.
          if (!cancelled) {
            showProgress(1);
            source.src = url;
          }
        });
      import("./hand-renderer")
        .then(({ createHandRenderer }) => {
          if (cancelled) return;
          try {
            const renderer = createHandRenderer(canvas, source, setReady, { frameRate: HANDS_FPS });
            rendererRef.current = renderer;
            renderer.seek(timeRef.current); // lo que el scroll ya pidió antes de existir
          } catch {
            setReady(false);
          }
        })
        .catch(() => setReady(false));
    } else {
      showProgress(1);
    }

    return () => {
      cancelled = true;
      controller.abort();
      rendererRef.current?.dispose();
      rendererRef.current = null;
      source.removeAttribute("src");
      source.load();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      document.removeEventListener("visibilitychange", syncBackdrop);
      reduced.removeEventListener("change", syncBackdrop);
      gestures.forEach((g) => window.removeEventListener(g, syncBackdrop));
      backdrop.pause();
      backdrop.removeAttribute("src");
      backdrop.load();
    };
  }, []);

  // Bucle de scroll: progreso → cuadro de las manos + parallax. Duerme cuando
  // nada cambia y despierta con scroll o resize.
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrollOwner = acquireScroll(); // Lenis (el mismo de la sección Halion)
    // táctil: 1:1 con el dedo; reducido: sin inercia; con Lenis ya hay suavizado
    const direct = coarse || reduced || scrollOwner.smooth;
    let lastCovered = false;
    const spring = new Spring(STIFFNESS);
    let initialized = false;
    let raf = 0;
    let idle = false;
    let lastNow = performance.now();
    let lastActivity = performance.now();
    let lastFrame = -1;
    let lastRaw = -1;
    let lastPast = -1;

    const wake = () => {
      lastActivity = performance.now();
      if (idle) {
        idle = false;
        lastNow = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const tick = (now: number) => {
      const dt = (now - lastNow) / 1000;
      lastNow = now;
      const pin = pinRef.current;
      const section = sectionRef.current;
      if (!pin || !section) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const vh = section.offsetHeight; // estable en móvil (svh), a diferencia de innerHeight
      const rect = pin.getBoundingClientRect();
      const range = Math.max(1, pin.offsetHeight - vh);
      const raw = clamp01(-rect.top / (range * (1 - HOLD_END)));
      const past = Math.max(0, -rect.top - range); // px recorridos tras soltar el hero
      const target = easeProgress(raw);
      if (!initialized) {
        spring.init(target);
        initialized = true;
      }
      const p = direct ? target : spring.step(target, dt);

      const time = p * TOUCH_TIME;
      timeRef.current = time;
      const frame = Math.round(time * HANDS_FPS);
      if (frame !== lastFrame && rendererRef.current) {
        lastFrame = frame;
        rendererRef.current.seek(time);
      }

      const q = reduced ? 0 : p;
      const bg = backdropWrapRef.current;
      const hands = handsRef.current;
      const title = titleRef.current;
      const footer = footerRef.current;
      // mientras el hero entra desde abajo, sus capas fijas bajan con él
      const enter = Math.max(0, rect.top);
      if (bg) bg.style.transform = `translate3d(0, ${(enter - 0.06 * vh * q).toFixed(1)}px, 0) scale(${(1 + 0.07 * q).toFixed(4)})`;
      // Las manos solo se trasladan (nunca se reescalan) y, pasado el hero, se van
      // exactamente con su sección (sin invadir la siguiente).
      if (hands) hands.style.transform = `translate3d(0, ${(enter - 0.04 * vh * q - past).toFixed(1)}px, 0)`;
      // Cada sección con su cabecera: la de MACS se retira mientras Halion ocupa la línea superior.
      const halionRect = halionRef.current?.getBoundingClientRect();
      const halionTop = halionRect?.top ?? Infinity;
      const halionBottom = halionRect?.bottom ?? -Infinity;
      const inHalion = halionTop <= HEADER_SWAP_PX && halionBottom > HEADER_SWAP_PX;
      const navWrap = navWrapRef.current;
      if (navWrap) {
        navWrap.style.visibility = inHalion ? "hidden" : "";
        navWrap.toggleAttribute("inert", inHalion);
      }
      // El video de fondo se pausa mientras Halion lo tapa por completo.
      const covered = halionTop <= 0 && halionBottom >= vh;
      if (covered !== lastCovered) {
        lastCovered = covered;
        backdropCoveredRef.current = covered;
        syncBackdropRef.current();
      }
      if (title) {
        title.style.transform = `translate3d(0, ${(-0.1 * vh * q).toFixed(1)}px, 0)`;
        title.style.opacity = (1 - smoothstep(q / 0.75)).toFixed(3); // se va del todo antes del toque
      }
      if (footer) {
        const opacity = 1 - clamp01(q / 0.45);
        footer.style.transform = `translate3d(0, ${(-0.03 * vh * q).toFixed(1)}px, 0)`;
        footer.style.opacity = opacity.toFixed(3);
        const hidden = opacity <= 0.02;
        footer.style.visibility = hidden ? "hidden" : "";
        footer.toggleAttribute("inert", hidden);
      }

      const settled = direct ? true : spring.settled(target);
      const quiet = raw === lastRaw && past === lastPast && settled && now - lastActivity > 250;
      lastRaw = raw;
      lastPast = past;
      if (quiet) {
        idle = true;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      backdropCoveredRef.current = false;
      releaseScroll();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${inter.variable} ${outfit.variable} handstouch-page w-full bg-white font-hero-sans text-black antialiased selection:bg-black selection:text-white`}
    >
      {/* Progreso de descarga del video (discreto, arriba). */}
      <div
        ref={progressRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[80] h-[2px] w-0 bg-black/60 transition-[width,opacity] duration-300"
      />

      <div ref={navWrapRef}>
        <Navbar />
      </div>

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
            src={POSTER_SRC}
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
        {/* Sección 1: Halion, clon literal que abre la página (ver components/halion). */}
        <div ref={halionRef}>
          <Halion />
        </div>

        {/* Sección 2 · recorrido de scroll del hero: la pantalla queda fija mientras las manos se acercan. */}
        <div ref={pinRef} style={{ height: `${PIN_VH}svh` }}>
          <section
            ref={sectionRef}
            aria-labelledby="hero-title"
            className="sticky top-0 flex h-svh w-full flex-col justify-between overflow-hidden"
          >
            <div aria-hidden="true" className="bottom-gradient" />
            <div ref={titleRef} className="relative z-30 flex min-h-0 flex-1 flex-col will-change-transform">
              <Hero />
            </div>
            <div ref={footerRef} className="relative z-30 will-change-transform">
              <Footer />
            </div>
          </section>
        </div>

        <About />
        <SiteFooter />
      </main>
    </div>
  );
}
