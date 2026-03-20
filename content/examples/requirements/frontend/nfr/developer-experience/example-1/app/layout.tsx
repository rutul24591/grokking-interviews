import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Config Doctor",
  description: "Frontend NFR: DX via config validation, redaction, and actionable errors.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

