import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Payment Request API Review",
  description: "Review browser-wallet handoff, totals stabilization, and fallback checkout safety before shipping Payment Request based checkout."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
