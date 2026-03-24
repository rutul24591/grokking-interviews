import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Asset Preloading (Example 2)",
  description: "A small preload budget + dedupe model.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

