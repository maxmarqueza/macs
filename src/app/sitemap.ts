import type { MetadataRoute } from "next";
import { mcHref, mcs } from "@/data/agents";
import { site } from "@/data/site";
import { solutions } from "@/data/solutions";

// Todas las páginas: portada, catálogos, fichas, soluciones, empresa y avisos legales.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: "2026-09-23",
      changeFrequency: "monthly",
      priority: 1,
    },
    ...["/agentes", "/robots", "/soluciones", "/como-trabajamos", "/nosotros", "/contacto"].map((path) => ({
      url: `${site.url}${path}`,
      lastModified: "2026-09-23",
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...mcs.map((mc) => ({
      url: `${site.url}${mcHref(mc)}`,
      lastModified: "2026-09-23",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...solutions.map((solution) => ({
      url: `${site.url}/soluciones/${solution.slug}`,
      lastModified: "2026-09-23",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...["/privacidad", "/terminos"].map((path) => ({
      url: `${site.url}${path}`,
      lastModified: "2026-09-23",
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
