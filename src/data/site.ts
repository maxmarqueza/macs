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
    "MACS es una familia de agentes de inteligencia artificial especializados. Cada Mc automatiza una parte de tu negocio: marketing, soporte, ventas y más.",
  ogDescription:
    "Cada Mc es un agente de IA especializado que automatiza una parte de tu negocio.",
  email: "contacto@macstech.mx",
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
