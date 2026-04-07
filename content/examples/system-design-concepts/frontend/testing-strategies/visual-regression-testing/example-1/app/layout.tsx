import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Visual Regression Testing Review",
  description: "Review screenshot baselines, diff severity, and release gating for frontend visual regression testing."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
