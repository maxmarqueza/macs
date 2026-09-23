/**
 * Datos del sitio (fuente única). Los usan la metadata de `layout.tsx` y
 * `page.tsx`, el JSON-LD, `sitemap.ts`, `robots.ts` y la imagen Open Graph.
 */
export const site = {
  name: "MACS",
  url: "https://macstech.mx",
  title: "MACS — Agentes IA para tu negocio",
  tagline: "Agentes IA para tu negocio",
  description:
    "MACS es una familia de agentes de inteligencia artificial y robots con IA. Cada Mc automatiza una parte de tu negocio: ventas, atención, administración y operación.",
  ogDescription:
    "Agentes de IA y robots con IA. Cada Mc automatiza una parte de tu negocio y aprende de tu operación.",
  email: "contacto@macstech.mx",
  /**
   * WhatsApp Business en formato internacional sin «+» ni espacios (p. ej. 5215512345678).
   * Vacío mientras Max no defina el número: el sitio no muestra el canal.
   */
  whatsapp: "" as string,
  locale: "es_MX",
  language: "es-MX",
} as const;

/**
 * Colores de marca en hex, para lo que no pasa por Tailwind (imágenes
 * generadas con next/og, theme-color). Son los mismos tokens que usa el sitio:
 * `neutral-950` y `sky-400` (ver docs/VISION.md). `src/app/icon.svg` los repite
 * porque un SVG estático no puede importarlos.
 */
export const brand = {
  background: "#0a0a0a",
  accent: "#38bdf8",
  accentRgb: "56,189,248",
} as const;

/**
 * Open Graph común a todas las rutas. Cada `page.tsx` debe definir su propio
 * `openGraph` (con `...openGraphBase`, `url`, título y descripción) y su
 * `alternates.canonical`: Next reemplaza el objeto `openGraph` completo en
 * cuanto una página lo define, y lo que se ponga en el layout lo hereda
 * cualquier ruta nueva.
 */
export const openGraphBase = {
  siteName: site.name,
  locale: site.locale,
  type: "website",
} as const;

/**
 * Metadata de una página interior: título, descripción, canonical, Open Graph y Twitter.
 * Con `ownImage`, la ruta tiene su propio `opengraph-image.tsx` (Next lo agrega solo y
 * Twitter lo toma de og:image); sin él, se usa la imagen general del sitio.
 */
export function pageMetadata({
  title,
  description,
  path,
  ownImage = false,
}: {
  title: string;
  description: string;
  path: string;
  ownImage?: boolean;
}) {
  const full = `${title} | ${site.name}`;
  const images = ownImage ? undefined : [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.title }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...openGraphBase, title: full, description, url: path, ...(images ? { images } : {}) },
    twitter: {
      card: "summary_large_image" as const,
      title: full,
      description,
      ...(images ? { images: ["/opengraph-image"] } : {}),
    },
  };
}
