import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Empty States - Example 1: Content dashboard empty-state system",
  description: "Empty States — Example 1"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
