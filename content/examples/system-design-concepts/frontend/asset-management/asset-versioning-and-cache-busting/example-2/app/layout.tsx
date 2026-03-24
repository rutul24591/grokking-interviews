import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Asset Versioning (Example 2)",
  description: "Compare query params vs filename hashing for cache busting.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

