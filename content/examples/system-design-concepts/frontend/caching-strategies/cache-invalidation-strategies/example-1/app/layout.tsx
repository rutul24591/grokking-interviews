import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cache Invalidation Strategies Example 1",
  description: "Cache Invalidation Strategies — Example 1"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
