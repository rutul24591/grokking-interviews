import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Network Status Detection (Connectivity Oracle)",
  description: "Combine browser signals with heartbeat verification and degraded state"
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">{props.children}</body>
    </html>
  );
}

