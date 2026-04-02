import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Feature Detection Lab",
  description: "Frontend NFR: cross-browser compatibility via feature detection and fallbacks.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

