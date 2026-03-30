import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Periodic Background Sync",
  description: "Attempt periodic sync registration, but always keep a graceful fallback"
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">{props.children}</body>
    </html>
  );
}

