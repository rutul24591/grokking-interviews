import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Tenant Lab",
  description: "A runnable multi-tenant isolation demo with bulkheads and quotas.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

