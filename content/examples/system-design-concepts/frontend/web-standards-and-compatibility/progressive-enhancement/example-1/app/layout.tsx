import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Progressive Enhancement - Example 1: Baseline article form",
  description: "Progressive Enhancement — Example 1"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
