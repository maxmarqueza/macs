import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site/SiteShell";
import { SolutionDetail } from "@/components/site/SolutionDetail";
import { pageMetadata } from "@/data/site";
import { getSolution, solutions } from "@/data/solutions";

// Solo existen los giros del catálogo; cualquier otra ruta es 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata(props: PageProps<"/soluciones/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const solution = getSolution(slug);
  if (!solution) return {};
  return pageMetadata({
    title: `${solution.name}: ${solution.promise.replace(/\.$/, "")}`,
    description: solution.summary,
    path: `/soluciones/${solution.slug}`,
    ownImage: true,
  });
}

export default async function Page(props: PageProps<"/soluciones/[slug]">) {
  const { slug } = await props.params;
  const solution = getSolution(slug);
  if (!solution) notFound();
  return (
    <SiteShell>
      <SolutionDetail solution={solution} />
    </SiteShell>
  );
}
