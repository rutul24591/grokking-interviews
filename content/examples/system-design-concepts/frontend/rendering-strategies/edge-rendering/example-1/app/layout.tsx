import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Edge Rendering (Example 1)",
  description: "Next.js Edge Runtime page + origin API.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

