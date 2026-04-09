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

  // Security headers + caching
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
          },
          {
            key: "Link",
            value:
              '<https://upload.wikimedia.org>; rel=preconnect, <https://mdn.github.io>; rel=preconnect, <https://developer.mozilla.org>; rel=preconnect',
          },
        ],
      },
      {
        source: "/diagrams/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
