import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dark Mode Implementation - Example 1: Theme preference center",
  description: "Dark Mode Implementation — Example 1"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
