import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cross-Browser Testing - Example 1: Compatibility checklist",
  description: "Cross-Browser Testing — Example 1"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
