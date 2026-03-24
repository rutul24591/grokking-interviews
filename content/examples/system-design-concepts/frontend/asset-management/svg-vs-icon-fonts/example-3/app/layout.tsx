import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "SVG vs Icon Fonts (Example 3)",
  description: "CSP constraints for icon delivery.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

