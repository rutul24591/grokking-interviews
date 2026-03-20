import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Edge Region Routing (Example 2)",
  description: "Middleware rewrite based on region.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

