import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "SSG Blog (Example 1)",
  description: "Static site generation with a Node build pipeline.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

