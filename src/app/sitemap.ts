import type { MetadataRoute } from "next";
import { site } from "@/data/site";

// El sitio es una sola página. Al agregar rutas (p. ej. /agentes/mcmarketing),
// añadirlas aquí.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
