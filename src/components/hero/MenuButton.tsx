"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** Menú de la barra: panel blanco a pantalla completa con la navegación del sitio. */
const ITEMS = [
  { label: "Inicio", href: "/" },
  { label: "Un Mc para cada área", href: "/#agentes" },
  { label: "McMarketing", href: "/agentes/mcmarketing" },
  { label: "Próximos Mc", href: "/#proximos" },
  { label: "Contacto", href: "/#contacto" },
] as const;

function PlusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

export default function MenuButton() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((value) => !value)}
        className="flex cursor-pointer items-center gap-2.5 rounded-full border border-black/[0.03] bg-black p-1 pr-5 text-[12px] font-medium text-white transition-all duration-200 hover:bg-zinc-800"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
          {open ? <CloseIcon /> : <PlusIcon />}
        </span>
        <span className="pr-1 text-[11.5px]">Menú</span>
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            id={id}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            onClick={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
            className="fixed inset-0 z-[90] flex flex-col bg-white px-8 pt-28 pb-10 text-black md:px-16 md:pt-36"
          >
            <nav className="mx-auto flex w-full max-w-7xl flex-col items-start gap-1">
              {ITEMS.map((item) => {
                const className =
                  "font-hero-display rounded-lg py-2 text-[9vw] leading-[1.05] font-medium tracking-tight underline-offset-8 hover:underline focus-visible:underline sm:text-[5.5vw] lg:text-[3.6vw]";
                // Anclas de la misma página: <a> normal para que Lenis las desplace con suavidad.
                return item.href.startsWith("/#") ? (
                  <a key={item.href} href={item.href} onClick={() => setOpen(false)} className={className}>
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={className}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <p className="mx-auto mt-auto w-full max-w-7xl text-[12px] text-black/60">
              MACS · Agentes IA para tu negocio · macstech.mx
            </p>
          </div>,
          document.body,
        )}
    </>
  );
}
