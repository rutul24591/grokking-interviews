import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Workers Example",
  description: "Lifecycle + caching strategies + message passing",
  icons: [{ rel: "icon", url: "/icon.svg" }]
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">{props.children}</body>
    </html>
  );
}

