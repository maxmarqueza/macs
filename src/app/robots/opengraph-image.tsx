import { brandImage, ogSize } from "@/lib/og";

export const alt = "Robots con IA | MACS";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return brandImage({ title: "Robots con IA", subtitle: "Trabajan en tu espacio y aprenden de tu operación." });
}
