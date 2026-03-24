import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Image Optimization (Example 3)",
  description: "Accept-based content negotiation with Vary: Accept.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

