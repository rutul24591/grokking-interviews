import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Chaos Lab",
  description: "A runnable chaos-testing demo with guardrails and reporting.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

