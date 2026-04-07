import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "E2E Testing Review",
  description: "Review full customer-journey E2E coverage, environment fidelity, and release risk."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
