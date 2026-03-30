import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Server State Management",
  description: "Server State Management — Example 1"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
