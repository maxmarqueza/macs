import type { ReactNode } from "react";
import { SiteShell } from "./SiteShell";

/** Páginas legales: texto sobrio, sin anillo, con fecha de actualización. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-6 pt-40 pb-16 md:px-12">
        <h1 className="font-hero-display text-[clamp(40px,6vw,72px)] leading-[0.95] font-medium tracking-[-0.03em]">{title}</h1>
        <p className="mt-4 text-[14px] text-black/50">Última actualización: {updated}</p>
        <div className="legal mt-12">{children}</div>
      </article>
    </SiteShell>
  );
}
