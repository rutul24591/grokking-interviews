import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Lazy Compute Lab",
  description: "Frontend NFR: build optimization via dynamic imports and feature boundaries.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

