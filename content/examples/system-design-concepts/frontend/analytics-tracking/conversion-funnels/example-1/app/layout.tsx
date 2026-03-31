import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Conversion funnels",
  description: "Track stage-by-stage article-to-signup conversion, visualize drop-off, and harden the funnel against ordering and duplicate milestone problems."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
