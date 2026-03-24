import type { ReactNode } from "react";
import "./globals.css";

export const metadata = { title: "Social Media Optimization (Example 2)" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

