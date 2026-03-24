import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Image Optimization (Example 2)",
  description: "Generate srcset/sizes strings safely.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

