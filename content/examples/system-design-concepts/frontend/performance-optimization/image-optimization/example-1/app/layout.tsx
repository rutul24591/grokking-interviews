import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Image Optimization",
  description: "Hero, gallery, and placeholder strategies for content pages.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
