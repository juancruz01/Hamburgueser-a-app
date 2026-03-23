import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Configuración limpia para evitar errores de tipos */
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      // Agrega aquí el hostname de tu Supabase Storage cuando subas tus propias fotos
      // ej: 'tu-id-proyecto.supabase.co'
    ],
  },
};

export default nextConfig;