/**
 * Datos del sitio (fuente única). Los usan la metadata de `layout.tsx`, el
 * JSON-LD, `sitemap.ts`, `robots.ts` y la imagen Open Graph.
 */
export const site = {
  name: "MACS",
  url: "https://macstech.mx",
  title: "MACS — Agentes IA para tu negocio",
  tagline: "Agentes IA para tu negocio",
  description:
    "MACS es una familia de agentes de inteligencia artificial especializados. Cada Mc automatiza una parte de tu negocio: marketing, soporte, ventas y más.",
  email: "contacto@macstech.mx",
  locale: "es_MX",
  language: "es-MX",
} as const;
