import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Optimistic UI Updates - Example 1: Feed action panel",
  description: "Optimistic UI Updates — Example 1"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
