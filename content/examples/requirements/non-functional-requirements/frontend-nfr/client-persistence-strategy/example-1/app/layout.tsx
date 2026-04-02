import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Outbox Lab",
  description: "Frontend NFR: client persistence with an outbox + idempotent delivery.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

