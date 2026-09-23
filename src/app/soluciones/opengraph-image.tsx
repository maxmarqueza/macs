import { brandImage, ogSize } from "@/lib/og";

export const alt = "Soluciones por giro | MACS";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return brandImage({ title: "Soluciones por giro", subtitle: "Los Mc que necesita tu tipo de negocio." });
}
