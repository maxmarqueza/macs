"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Escena del hero (adaptada de github.com/vikod3/handstouch): video ambiental
 * de fondo, el contenido en medio y, por encima, una mano humana y una robótica
 * que se buscan. Las manos se componen en WebGL con `hand-renderer.ts`; hasta
 * que llega el primer cuadro (o si WebGL falla) se ve el póster estático.
 */
export default function HeroScene({ children }: { children: ReactNode }) {
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
      backdrop.pause();
    };
  }, []);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
      >
        <video
          ref={backdropRef}
          src="/media/background.mp4"
          className="absolute inset-0 h-full w-full object-cover motion-safe:animate-hero-backdrop"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
        />
      </div>

      {/* Funde el video con el fondo blanco de la siguiente sección; queda bajo el texto. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-56 bg-linear-to-t from-white via-white/80 via-48% to-transparent"
      />

      <div className="relative z-10 flex flex-1 flex-col">{children}</div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 select-none overflow-hidden"
      >
        <div
          data-ready={ready}
          className="group absolute top-[calc(33%_+_200px)] left-0 aspect-[3/1] w-full -translate-y-1/2 sm:top-[calc(27.5%_+_200px)]"
        >
          <Image
            src="/media/hands-poster.webp"
            alt=""
            width={1920}
            height={640}
            priority
            unoptimized
            draggable={false}
            className="absolute inset-0 h-full w-full transition-opacity duration-300 group-data-[ready=true]:opacity-0"
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 group-data-[ready=true]:opacity-100"
          />
        </div>
        <video
          ref={sourceRef}
          src="/media/hands-rgba.mp4"
          className="absolute h-px w-px opacity-0"
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
