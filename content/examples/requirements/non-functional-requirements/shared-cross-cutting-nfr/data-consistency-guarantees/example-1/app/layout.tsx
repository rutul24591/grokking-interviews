import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Consistency Playground",
  description: "Primary + replicas with lag; eventual vs read-your-writes.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

