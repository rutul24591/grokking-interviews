import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Background Sync (Outbox)",
  description: "Queue mutations and drain via service worker sync (with manual fallback)"
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">{props.children}</body>
    </html>
  );
}

