import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "SSG Search (Example 2)",
  description: "Build-time search index shipped as static JSON.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

