import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polyfills and Transpilation - Example 1: Compatibility build planner",
  description: "Polyfills and Transpilation — Example 1"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
