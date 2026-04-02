import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Canary Lab",
  description: "A runnable canary rollout demo with guardrails and automation.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

