import type { MetadataRoute } from "next";
import { mcHref, mcs } from "@/data/agents";
import { site } from "@/data/site";

// Portada, catálogos, proceso y la ficha de cada Mc (agente o robot).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: "2026-09-23",
      changeFrequency: "monthly",
      priority: 1,
    },
    ...["/agentes", "/robots", "/como-trabajamos"].map((path) => ({
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
  ];
}
