import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Font Loading Strategies (Example 2)",
  description: "Dynamically load non-critical fonts after user intent.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="app-font">{children}</body>
    </html>
  );
}

