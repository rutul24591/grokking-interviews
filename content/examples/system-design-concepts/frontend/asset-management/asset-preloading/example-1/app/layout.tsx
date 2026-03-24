import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Asset Preloading (Example 1)",
  description: "Preload above-the-fold assets with cache-safe headers.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preload only truly critical assets. */}
        <link
          rel="preload"
          as="image"
          href="/api/assets/hero?variant=hero&delayMs=250"
          // If this were cross-origin, you would also set crossOrigin.
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

