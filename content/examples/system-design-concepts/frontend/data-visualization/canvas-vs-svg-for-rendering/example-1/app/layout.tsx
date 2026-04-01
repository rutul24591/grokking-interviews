import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Canvas vs SVG for Rendering",
  description: "Compare scene rendering strategies with interaction and scale tradeoffs."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
