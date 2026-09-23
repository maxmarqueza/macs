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
import type { MacsBurst } from "./macs-burst";
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
 * Secciones de la portada, independientes entre sí y sin transición: (1) este
 * bloque, manos → explosión de partículas que termina en la palabra «MACS», que
 * se queda formada y sale con la sección; (2) Halion, clon literal con su propio
 * arranque; (3) «Un Mc para cada área» y pie de MACS.
 *
 * Carga: el video del nivel elegido se descarga completo con `fetch` (barra de
 * progreso discreta) y se asigna como Blob, así cada búsqueda es local y nunca
 * espera a la red. Mientras llega, el póster (cuadro 0) queda quieto y las manos
 * alcanzan la posición del scroll en cuanto hay datos.
 */

const TOUCH_TIME = (HANDS_FRAMES - 1) / HANDS_FPS; // último cuadro: dedos en contacto
const HERO_VH = 180; // recorrido de scroll del acercamiento (además de la pantalla fija)
const BURST_VH = 240; // recorrido de la explosión de partículas que forma «MACS» (y su pausa final)
const PIN_VH = 100 + HERO_VH + BURST_VH; // alto total del bloque fijo
const HEADER_SWAP_PX = 72; // la barra de MACS vuelve cuando la sección final llega a su altura
const HOLD_END = 0.06; // fracción final del acercamiento en que el toque se sostiene
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
  const burstCanvasRef = useRef<HTMLCanvasElement>(null);
  const burstRef = useRef<MacsBurst | null>(null);
  const navWrapRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: -1e3, y: -1e3, inside: false });
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
    const scrollOwner = acquireScroll(); // Lenis (el mismo de la escena Halion)
    // táctil: 1:1 con el dedo; reducido: sin inercia; con Lenis ya hay suavizado
    const direct = coarse || reduced || scrollOwner.smooth;
    const spring = new Spring(STIFFNESS);
    let burstWanted = false;
    let lastCovered = false;
    let lastBurstActive = true;
    let contactAtTouch = false;

    // Explosión de partículas (escena de MaSa): se crea en cuanto el acercamiento
    // va por la mitad, para que esté lista al tocarse los dedos.
    const placeContact = () => {
      const frame = document.querySelector<HTMLElement>(".hands-frame");
      if (!frame || !burstRef.current) return;
      const r = frame.getBoundingClientRect();
      // yemas en contacto: centro horizontal, 28 % desde arriba del marco (medido en el último cuadro)
      burstRef.current.setContact(r.left + r.width * 0.5, r.top + r.height * 0.28);
    };
    const ensureBurst = () => {
      if (burstWanted) return;
      burstWanted = true;
      const canvas = burstCanvasRef.current;
      if (!canvas || reduced) return;
      const family = getComputedStyle(document.getElementById("hero-title") ?? document.body).fontFamily;
      const fontReady = document.fonts?.load(`500 200px ${family.split(",")[0]}`).catch(() => undefined) ?? Promise.resolve();
      Promise.all([import("./macs-burst"), fontReady]).then(([{ createMacsBurst }]) => {
        if (burstRef.current || !burstCanvasRef.current || burstWanted === false) return;
        try {
          const burst = createMacsBurst(burstCanvasRef.current, family);
          burstRef.current = burst;
          placeContact();
        } catch {
          burstRef.current = null;
        }
      });
    };
    const onMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY, inside: true };
    };
    const onLeave = () => {
      pointerRef.current = { ...pointerRef.current, inside: false };
    };
    const onResize = () => {
      burstRef.current?.resize();
      placeContact();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    let initialized = false;
    let raf = 0;
    let idle = false;
    let lastNow = performance.now();
    let lastActivity = performance.now();
    let lastFrame = -1;
    let lastRaw = -1;
    let lastPast = -1;
    let lastP2 = -1;

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
      const heroRange = Math.max(1, (HERO_VH / 100) * vh);
      const burstRange = Math.max(1, pin.offsetHeight - vh - heroRange);
      const raw = clamp01(-rect.top / (heroRange * (1 - HOLD_END)));
      const p2 = clamp01((-rect.top - heroRange) / burstRange); // explosión → palabra → disolución
      const past = Math.max(0, -rect.top - heroRange - burstRange); // px recorridos tras soltar el bloque
      const target = easeProgress(raw);
      if (raw > 0.5) ensureBurst();
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
      if (bg) bg.style.transform = `translate3d(0, ${(-0.06 * vh * q).toFixed(1)}px, 0) scale(${(1 + 0.07 * q).toFixed(4)})`;
      // Las manos solo se trasladan (nunca se reescalan); al empezar la explosión se apagan.
      const handsOpacity = 1 - smoothstep((p2 - 0.12) / 0.18);
      if (hands) {
        hands.style.transform = `translate3d(0, ${(-0.04 * vh * q).toFixed(1)}px, 0)`;
        hands.style.opacity = handsOpacity.toFixed(3);
        hands.style.visibility = handsOpacity <= 0.01 ? "hidden" : "";
      }
      // Escena de la explosión: oscurece la pantalla, estalla desde las yemas y forma «MACS».
      const darken = smoothstep(p2 / 0.12);
      // la palabra termina de formarse al 62 % y se sostiene hasta que la sección sale
      const explode = smoothstep((p2 - 0.12) / 0.5);
      const dissolve = 0;
      const burstCanvas = burstCanvasRef.current;
      if (burstCanvas) {
        burstCanvas.style.opacity = darken.toFixed(3);
        burstCanvas.style.visibility = darken <= 0.001 ? "hidden" : "";
      }
      // el origen se fija con las manos en su posición final, justo al tocarse
      if (p2 > 0 && !contactAtTouch && burstRef.current) {
        contactAtTouch = true;
        placeContact();
      } else if (p2 <= 0) {
        contactAtTouch = false;
      }
      burstRef.current?.update({ explode, dissolve, pointer: reduced ? { x: -1e3, y: -1e3, inside: false } : pointerRef.current });
      // La escena solo se dibuja mientras está en pantalla (la Halion la cubre después).
      const burstActive = darken > 0.001 && rect.bottom > 0;
      if (burstActive !== lastBurstActive) {
        lastBurstActive = burstActive;
        burstRef.current?.setActive(burstActive);
      }
      // La barra de MACS se apaga en la escena oscura y vuelve con las secciones claras del final.
      const after = afterRef.current;
      // relevo de cabeceras en el borde entre Halion y esta sección (alto de la barra)
      const afterIn = after ? after.getBoundingClientRect().top <= HEADER_SWAP_PX : false;
      const navOpacity = afterIn ? 1 : 1 - smoothstep((p2 - 0.02) / 0.1);
      const navWrap = navWrapRef.current;
      if (navWrap) {
        navWrap.style.opacity = navOpacity.toFixed(3);
        navWrap.style.visibility = navOpacity <= 0.01 ? "hidden" : "";
      }
      // El video de fondo se pausa mientras las escenas oscuras lo tapan por completo.
      const covered = darken >= 0.999 && !afterIn;
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
      const quiet = raw === lastRaw && past === lastPast && p2 === lastP2 && settled && now - lastActivity > 250;
      lastRaw = raw;
      lastPast = past;
      lastP2 = p2;
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
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      burstWanted = false;
      burstRef.current?.dispose();
      burstRef.current = null;
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
        {/* Recorrido de scroll del hero: la pantalla queda fija mientras las manos se acercan. */}
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
            {/* Explosión de partículas (escena de MaSa) que forma «MACS» tras el toque. */}
            <canvas
              ref={burstCanvasRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-40 h-full w-full opacity-0"
            />
          </section>
        </div>

        {/* Escena siguiente: Halion, clon literal (ver components/halion). */}
        <Halion />

        <div ref={afterRef}>
          <About />
          <SiteFooter />
        </div>
      </main>
    </div>
  );
}
