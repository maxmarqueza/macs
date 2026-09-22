"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Capas de video del hero (adaptado de HandsOverlay.tsx de vikod3/handstouch):
 * video ambiental de fondo, el degradado inferior y, por encima, las manos
 * humana y robótica compuestas en WebGL con `hand-renderer.ts`. Hasta que llega
 * el primer cuadro (o si WebGL falla) se ve el póster estático.
 *
 * Los videos existen en varias resoluciones (máximo 4K UHD, 3840 px de ancho).
 * Se elige la mínima que cubre los píxeles reales de la pantalla (ancho CSS ×
 * densidad), para que en retina y monitores 4K nunca se escale hacia arriba y
 * los teléfonos no descarguen el archivo grande.
 */

type Tier = readonly [maxWidth: number, src: string];

const HANDS_TIERS: readonly Tier[] = [
  [1920, "/media/hands-rgba-1920.mp4"],
  [3072, "/media/hands-rgba-3072.mp4"],
  [Infinity, "/media/hands-rgba-3840.mp4"],
];

const BACKDROP_TIERS: readonly Tier[] = [
  [1920, "/media/background-1920.mp4"],
  [Infinity, "/media/background-3840.mp4"],
];

function pickSource(neededWidth: number, tiers: readonly Tier[]) {
  return (tiers.find(([max]) => neededWidth <= max) ?? tiers[tiers.length - 1])[1];
}

export default function HeroScene() {
  const backdropRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const canvas = canvasRef.current;
    const source = sourceRef.current;
    if (!backdrop || !canvas || !source) return;

    let cancelled = false;
    let dispose: (() => void) | undefined;

    // Píxeles reales que cubre el hero (ancho CSS × densidad, tope 3×).
    const neededWidth = Math.ceil(
      window.innerWidth * Math.min(window.devicePixelRatio || 1, 3),
    );
    backdrop.src = pickSource(neededWidth, BACKDROP_TIERS);
    source.src = pickSource(neededWidth, HANDS_TIERS);

    // Fondo: `muted` se fija aquí porque React no lo serializa como atributo
    // y sin él los navegadores bloquean la reproducción automática.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    backdrop.muted = true;
    const syncBackdrop = () => {
      if (reducedMotion.matches || document.hidden) backdrop.pause();
      else void backdrop.play().catch(() => {});
    };
    syncBackdrop();
    reducedMotion.addEventListener("change", syncBackdrop);
    document.addEventListener("visibilitychange", syncBackdrop);
    // Si el navegador bloqueó la reproducción automática (p. ej. modo de bajo
    // consumo en iOS), el primer toque la reanuda.
    window.addEventListener("pointerdown", syncBackdrop, { passive: true });

    // Manos: el compositor se carga aparte para no engordar el bundle inicial.
    import("./hand-renderer")
      .then(({ createHandRenderer }) => {
        if (cancelled) return;
        try {
          dispose = createHandRenderer(canvas, source, setReady);
        } catch {
          setReady(false);
        }
      })
      .catch(() => setReady(false));

    return () => {
      cancelled = true;
      dispose?.();
      reducedMotion.removeEventListener("change", syncBackdrop);
      document.removeEventListener("visibilitychange", syncBackdrop);
      window.removeEventListener("pointerdown", syncBackdrop);
      backdrop.pause();
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 select-none motion-safe:animate-hero-backdrop"
      >
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

      <div aria-hidden="true" className="bottom-gradient" />

      <div className="hands-overlay" aria-hidden="true">
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
          loop
          tabIndex={-1}
          disablePictureInPicture
          disableRemotePlayback
        />
      </div>
    </>
  );
}
