import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Partial Hydration (Example 2)",
  description: "Defer heavy widgets with dynamic import.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

