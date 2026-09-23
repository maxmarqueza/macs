import { brandImage, ogSize } from "@/lib/og";

export const alt = "Cómo trabajamos | MACS";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return brandImage({ title: "Cómo trabajamos", subtitle: "Primero entendemos tu negocio. Después lo automatizamos." });
}
