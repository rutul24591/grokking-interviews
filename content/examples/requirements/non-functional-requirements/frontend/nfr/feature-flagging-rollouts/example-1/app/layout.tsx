import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Flag Lab",
  description: "Frontend NFR: feature flags with deterministic rollout + kill switch.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

