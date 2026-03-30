import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PWA Example (Offline Support)",
  description: "Install prompt + manifest + service worker registration in Next.js",
  manifest: "/manifest.webmanifest",
  icons: [{ rel: "icon", url: "/icon.svg" }]
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">{props.children}</body>
    </html>
  );
}

