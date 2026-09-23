import { robots, getMc } from "@/data/agents";
import { brandImage, ogSize } from "@/lib/og";

export const alt = "Robots con IA | MACS";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return robots.map((mc) => ({ slug: mc.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mc = getMc("robot", slug);
  return brandImage({
    eyebrow: mc ? `Robots con IA / ${mc.area}` : "Robots con IA",
    title: mc?.name ?? "MACS",
    subtitle: mc?.promise ?? "",
  });
}
