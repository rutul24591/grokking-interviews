import type { ReactNode } from "react";
import "./globals.css";
import "./fonts.css";

export const metadata = {
  title: "Font Loading Strategies (Example 1)",
  description: "Self-hosted fonts with preload and font-display: swap.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preload the critical default font file used above-the-fold. */}
        <link rel="preload" as="font" href="/fonts/sora-400.ttf" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body className="app-font">{children}</body>
    </html>
  );
}

