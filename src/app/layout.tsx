import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://macstech.mx"),
  title: {
    default: "MACS — Agentes IA para tu negocio",
    template: "%s | MACS",
  },
  description:
    "MACS es una familia de agentes de inteligencia artificial especializados. Cada Mc automatiza una parte de tu negocio: marketing, soporte, ventas y más.",
  openGraph: {
    title: "MACS — Agentes IA para tu negocio",
    description:
      "Cada Mc es un agente de IA especializado que automatiza una parte de tu negocio.",
    url: "https://macstech.mx",
    siteName: "MACS",
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
