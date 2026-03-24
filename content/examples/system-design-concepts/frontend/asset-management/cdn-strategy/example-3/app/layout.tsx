import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "CDN Strategy (Example 3)",
  description: "Multi-CDN failover with a client-side circuit breaker.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

