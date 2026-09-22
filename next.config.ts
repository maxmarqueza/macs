import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 para el póster del hero (next/image lo redimensiona por pantalla).
    qualities: [75, 90],
  },
  // Los videos e imágenes de /media llevan versión en el nombre (ver
  // src/data/media.ts), así que pueden cachearse un año sin revalidar.
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
