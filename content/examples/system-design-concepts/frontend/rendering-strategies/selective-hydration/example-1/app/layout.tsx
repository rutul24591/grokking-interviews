import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Selective Hydration (Example 1)",
  description: "Suspense + event replay demo.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

