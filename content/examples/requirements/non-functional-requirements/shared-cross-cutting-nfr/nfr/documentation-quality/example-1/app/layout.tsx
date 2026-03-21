import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Docs Quality Gate",
  description: "Lint docs for required sections, freshness, and runnable commands.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

