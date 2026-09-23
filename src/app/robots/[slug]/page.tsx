import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { McDetail } from "@/components/site/McDetail";
import { SiteShell } from "@/components/site/SiteShell";
import { getMc, mcHref, robots } from "@/data/agents";
import { pageMetadata } from "@/data/site";

// Solo existen las fichas del catálogo; cualquier otra ruta es 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return robots.map((mc) => ({ slug: mc.slug }));
}

export async function generateMetadata(props: PageProps<"/robots/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const mc = getMc("robot", slug);
  if (!mc) return {};
  return pageMetadata({ title: `${mc.name}: ${mc.promise.replace(/\.$/, "")}`, description: mc.summary, path: mcHref(mc), ownImage: true });
}

export default async function Page(props: PageProps<"/robots/[slug]">) {
  const { slug } = await props.params;
  const mc = getMc("robot", slug);
  if (!mc) notFound();
  return (
    <SiteShell>
      <McDetail mc={mc} />
    </SiteShell>
  );
}
