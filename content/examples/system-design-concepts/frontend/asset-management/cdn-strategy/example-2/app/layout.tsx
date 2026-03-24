import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "CDN Strategy (Example 2)",
  description: "Cache key normalization and Vary pitfalls.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

