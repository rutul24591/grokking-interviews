import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "CI/CD Pipelines Review",
  description: "Review build validation stages, artifact promotion rules, and release gates for frontend CI/CD pipelines."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
