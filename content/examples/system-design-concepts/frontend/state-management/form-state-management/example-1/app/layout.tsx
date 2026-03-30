import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Form State Management Example 1",
  description: "Form State Management — Example 1"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
