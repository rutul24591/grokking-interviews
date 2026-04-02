import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Responsive Policy Lab",
  description: "Frontend NFR: device responsiveness via explicit layout policies.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

