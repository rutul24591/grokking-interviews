import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Browser Feature Detection - Example 1: Capability-based UX lab",
  description: "Browser Feature Detection — Example 1"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
