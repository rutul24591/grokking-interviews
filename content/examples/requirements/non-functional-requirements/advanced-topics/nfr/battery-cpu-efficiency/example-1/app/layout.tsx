import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Efficiency Lab",
  description: "Battery + CPU efficiency demo with ETags, adaptive polling, and long-task telemetry.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

