import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Intersection Observer API Review",
  description: "Review lazy loading, impression timing, and scroll-anchor preservation when viewport visibility drives behavior."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
