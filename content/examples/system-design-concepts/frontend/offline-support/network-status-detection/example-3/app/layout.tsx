import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Network Status Detection (Circuit Breaker)",
  description: "Online can still fail: use circuit breaker + queueing"
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">{props.children}</body>
    </html>
  );
}

