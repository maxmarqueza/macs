import type { MetadataRoute } from "next";
import { agents } from "@/data/agents";
import { site } from "@/data/site";

// Solo incluir agentes que ya tienen una página publicada.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...agents.flatMap((agent) =>
      agent.href
        ? [{ url: `${site.url}${agent.href}`, changeFrequency: "monthly" as const, priority: 0.8 }]
        : [],
    ),
  ];
}
