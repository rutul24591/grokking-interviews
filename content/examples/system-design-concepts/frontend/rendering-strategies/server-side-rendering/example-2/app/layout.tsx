import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "SSR Waterfalls (Example 2)",
  description: "Sequential vs parallel fetch in SSR.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

