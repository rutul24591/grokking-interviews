import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "CDN Delivery",
  description: "Model content delivery policy, origin failover, and cache scope for user-facing media and article pages."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
