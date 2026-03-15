import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Flaticon
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
      // Supabase Storage público
      {
        protocol: "https",
        hostname: "sszyfwfazrxewdarezbn.supabase.co",
        pathname: "/storage/v1/object/public/duddallos_products/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;