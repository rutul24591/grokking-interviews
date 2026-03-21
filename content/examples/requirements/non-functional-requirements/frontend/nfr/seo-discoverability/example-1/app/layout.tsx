import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | SEO Demo",
    default: "SEO & Discoverability"
  },
  description: "Demonstrates metadata, canonical URLs, robots, sitemap, and JSON-LD."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

