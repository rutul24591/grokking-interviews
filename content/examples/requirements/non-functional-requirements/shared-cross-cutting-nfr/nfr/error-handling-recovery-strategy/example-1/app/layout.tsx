import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Resilient Publish",
  description: "Error handling + recovery: idempotency, retries, circuit breaker.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

