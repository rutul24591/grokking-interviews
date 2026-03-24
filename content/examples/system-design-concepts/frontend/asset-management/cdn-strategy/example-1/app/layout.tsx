import type { ReactNode } from "react";
import "./globals.css";
import { getPublicEnv } from "@/lib/env";

export const metadata = {
  title: "CDN Strategy (Example 1)",
  description: "Serve static assets from a CDN origin with correct cache headers.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const { NEXT_PUBLIC_CDN_ORIGIN } = getPublicEnv();

  return (
    <html lang="en">
      <head>
        <link rel="dns-prefetch" href={NEXT_PUBLIC_CDN_ORIGIN} />
        <link rel="preconnect" href={NEXT_PUBLIC_CDN_ORIGIN} crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
