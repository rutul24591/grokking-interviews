import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "mdn.github.io" },
      { protocol: "https", hostname: "developer.mozilla.org" },
    ],
  },

  // TypeScript strict mode
  typescript: {
    ignoreBuildErrors: false,
  },

  // Enable static exports for articles
  // output: "export", // Uncomment for static site generation
  async redirects() {
    return [
      {
        source: "/backend/network-communication/server-sent-events-sse",
        destination: "/backend/network-communication/server-sent-events",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
