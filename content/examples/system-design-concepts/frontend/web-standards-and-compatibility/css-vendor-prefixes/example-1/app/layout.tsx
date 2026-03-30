import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSS Vendor Prefixes - Example 1: Prefix compatibility panel",
  description: "CSS Vendor Prefixes — Example 1"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
