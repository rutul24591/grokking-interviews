import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Selective Hydration Boundaries (Example 3)",
  description: "Boundary placement impact on hydration.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

