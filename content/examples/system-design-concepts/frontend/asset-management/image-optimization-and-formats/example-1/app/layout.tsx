import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Image Optimization & Formats (Example 1)",
  description: "Responsive images + AVIF/WebP/PNG fallback using <picture>.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

