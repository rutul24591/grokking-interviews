import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Trace Lab",
  description: "End-to-end observability demo with traceparent propagation.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

