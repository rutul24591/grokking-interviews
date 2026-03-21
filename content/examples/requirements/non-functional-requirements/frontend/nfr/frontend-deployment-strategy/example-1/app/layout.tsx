import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Release Rings",
  description: "Frontend NFR: deployment strategy via canary rings and sticky assignment.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

