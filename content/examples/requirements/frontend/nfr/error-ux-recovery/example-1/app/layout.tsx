import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Retry Lab",
  description: "Frontend NFR: error UX + recovery with retries/backoff.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

