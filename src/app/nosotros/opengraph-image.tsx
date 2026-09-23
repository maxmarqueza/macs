import { brandImage, ogSize } from "@/lib/og";

export const alt = "Nosotros | MACS";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return brandImage({ title: "Nosotros", subtitle: "Inteligencia hecha humana." });
}
