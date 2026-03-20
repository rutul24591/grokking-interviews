import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Selective Hydration Events (Example 2)",
  description: "Discrete vs continuous events during hydration.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

