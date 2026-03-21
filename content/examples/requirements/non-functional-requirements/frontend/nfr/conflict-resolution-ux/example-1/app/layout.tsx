import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Conflict Lab",
  description: "Frontend NFR: conflict resolution UX for optimistic edits.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

