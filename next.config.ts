import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 para el póster del hero (next/image lo redimensiona por pantalla).
    qualities: [75, 90],
  },
};

export default nextConfig;
