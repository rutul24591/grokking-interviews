import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Web Workers Review",
  description: "Review off-thread computation, versioned worker protocols, and stale-result rejection for Web Worker based features."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
