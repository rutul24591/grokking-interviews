import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "SSG Preview (Example 3)",
  description: "Draft mode / preview for SSG content.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

