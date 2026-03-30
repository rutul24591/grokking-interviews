import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Periodic Sync With Conditional Fetch",
  description: "Use ETag / If-None-Match so refresh stays cheap"
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">{props.children}</body>
    </html>
  );
}

