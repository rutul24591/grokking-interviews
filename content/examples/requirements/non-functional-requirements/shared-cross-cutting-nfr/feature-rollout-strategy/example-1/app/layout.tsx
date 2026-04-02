import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Feature Rollout",
  description: "Percent rollout + guardrails + kill switch.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

