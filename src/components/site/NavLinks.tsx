"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/agentes", label: "Agentes IA" },
  { href: "/robots", label: "Robots" },
  { href: "/soluciones", label: "Soluciones" },
  { href: "/como-trabajamos", label: "Cómo trabajamos" },
  { href: "/nosotros", label: "Nosotros" },
] as const;

/** Pastilla de secciones de la barra; marca la sección en la que está el visitante. */
export default function NavLinks() {
  const pathname = usePathname();
  return (
    <div className="hidden h-11 items-center gap-5 rounded-full border border-black/[0.03] bg-[#F4F4F6] px-6 text-[11.5px] font-normal text-black/60 lg:flex">
      {LINKS.map((link) => {
        const current = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={current ? "page" : undefined}
            className={`transition-colors hover:text-black ${current ? "text-black" : ""}`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
