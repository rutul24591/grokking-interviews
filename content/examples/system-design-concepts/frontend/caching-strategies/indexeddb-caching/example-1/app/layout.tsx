import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Indexeddb Caching Example 1",
  description: "IndexedDB Caching — Example 1"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
