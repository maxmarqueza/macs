import type { MetadataRoute } from "next";
import { agents } from "@/data/agents";
import { site } from "@/data/site";

// Solo incluir agentes que ya tienen una página publicada.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: "2026-09-22",
      changeFrequency: "monthly",
      priority: 1,
    },
    ...agents.flatMap((agent) =>
      agent.href
        ? [{ url: `${site.url}${agent.href}`, lastModified: "2026-09-10", changeFrequency: "monthly" as const, priority: 0.8 }]
        : [],
    ),
  ];
}
