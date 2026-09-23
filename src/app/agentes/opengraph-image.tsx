import { brandImage, ogSize } from "@/lib/og";

export const alt = "Agentes IA | MACS";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return brandImage({ title: "Agentes IA", subtitle: "Un Mc para cada tarea que se repite." });
}
