import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Page view tracking",
  description: "Track canonical SPA page views, preserve referrer transitions, and suppress false positives from hydration or hash-only navigation."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
