import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IndexedDB Migrations Example",
  description: "Upgrade patterns and data transforms"
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">{props.children}</body>
    </html>
  );
}

