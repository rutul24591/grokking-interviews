import type { ReactNode } from "react";
import "./globals.css";
import { getPublicEnv } from "@/lib/env";

export const metadata = {
  title: "Font Loading Strategies (Example 3)",
  description: "Cross-origin font hosting with CORS and preconnect.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const { NEXT_PUBLIC_FONT_CDN_ORIGIN } = getPublicEnv();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href={NEXT_PUBLIC_FONT_CDN_ORIGIN} crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}

