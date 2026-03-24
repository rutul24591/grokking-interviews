import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "SVG vs Icon Fonts (Example 2)",
  description: "Sanitize inline SVG before rendering.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

