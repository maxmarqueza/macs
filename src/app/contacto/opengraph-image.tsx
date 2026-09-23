import { brandImage, ogSize } from "@/lib/og";

export const alt = "Contacto | MACS";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return brandImage({ title: "Contacto", subtitle: "Cuéntanos qué quieres automatizar." });
}
