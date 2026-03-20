import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "ISR Personalization (Example 3)",
  description: "Shared caching vs personalized pages.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

