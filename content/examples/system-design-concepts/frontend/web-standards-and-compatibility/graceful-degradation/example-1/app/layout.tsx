import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Graceful Degradation - Example 1: Fallback-first document viewer",
  description: "Graceful Degradation — Example 1"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
