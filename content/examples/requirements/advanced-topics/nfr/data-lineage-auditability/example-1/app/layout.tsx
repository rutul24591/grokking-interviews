import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Lineage Ledger",
  description: "Data lineage + auditability demo with an append-only hash-chained ledger.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

