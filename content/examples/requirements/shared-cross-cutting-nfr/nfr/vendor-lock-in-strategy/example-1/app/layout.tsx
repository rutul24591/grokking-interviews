import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Portable Object Store",
  description: "Vendor lock-in strategy demo with adapters, contracts, and a mock S3-compatible API.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

