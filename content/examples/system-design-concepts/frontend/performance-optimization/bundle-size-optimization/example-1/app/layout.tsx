import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Bundle Size Optimization",
  description: "Keep the initial route small and defer heavy code.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

