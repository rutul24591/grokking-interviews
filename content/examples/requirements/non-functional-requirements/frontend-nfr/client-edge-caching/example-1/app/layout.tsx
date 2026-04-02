import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Caching Lab",
  description: "Frontend NFR: client + edge caching concepts with observability.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

