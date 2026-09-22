"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ScrollHero, { type Variant } from "./ScrollHero";

/** Vista previa: la portada por scroll con selector de variante (`?v=a|b`). */
export default function ScrollHeroLab() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const param = searchParams.get("v");
  const variant: Variant = param === "a" || param === "b" ? param : "b";
  const choose = (v: Variant) => {
    router.replace(`/lab/scroll?v=${v}`, { scroll: false });
    window.scrollTo({ top: 0 });
  };
  return <ScrollHero variant={variant} onVariantChange={choose} />;
}
