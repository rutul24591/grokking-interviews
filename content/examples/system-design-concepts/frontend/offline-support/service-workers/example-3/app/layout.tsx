import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SW Multi-tab Coordination",
  description: "Leader-based activation for skipWaiting",
  icons: [{ rel: "icon", url: "/icon.svg" }]
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">{props.children}</body>
    </html>
  );
}

