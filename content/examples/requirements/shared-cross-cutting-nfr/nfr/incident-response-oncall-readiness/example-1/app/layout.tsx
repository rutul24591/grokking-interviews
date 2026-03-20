import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Incident Console",
  description: "Incident response demo: alert dedup, incident timeline, escalation.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

