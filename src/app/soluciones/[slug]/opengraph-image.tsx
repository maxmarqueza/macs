import { getSolution, solutions } from "@/data/solutions";
import { brandImage, ogSize } from "@/lib/og";

export const alt = "Soluciones por giro | MACS";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return solutions.map((solution) => ({ slug: solution.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = getSolution(slug);
  return brandImage({
    eyebrow: "Soluciones por giro",
    title: solution?.name ?? "MACS",
    subtitle: solution?.promise ?? "",
  });
}
