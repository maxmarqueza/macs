import { agents, getMc } from "@/data/agents";
import { brandImage, ogSize } from "@/lib/og";

export const alt = "Agentes IA | MACS";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return agents.map((mc) => ({ slug: mc.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mc = getMc("agente", slug);
  return brandImage({
    eyebrow: mc ? `Agentes IA / ${mc.area}` : "Agentes IA",
    title: mc?.name ?? "MACS",
    subtitle: mc?.promise ?? "",
  });
}
