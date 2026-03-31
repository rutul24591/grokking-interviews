import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Privacy-compliant tracking",
  description: "Scrub PII, hash stable identifiers, and apply retention-safe sampling rules before analytics data leaves the browser."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
