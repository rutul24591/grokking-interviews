import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "4001" },
      { protocol: "http", hostname: "localhost", port: "4002" },
    ],
  },
};

export default nextConfig;

