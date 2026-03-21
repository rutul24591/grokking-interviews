import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Progressive Enhancement Demo",
  description: "Form + pagination that works without JS and gets enhanced with JS.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

