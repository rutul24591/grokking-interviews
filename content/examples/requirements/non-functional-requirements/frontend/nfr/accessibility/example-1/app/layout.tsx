import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Accessibility Gate",
  description: "Frontend NFR: accessibility contracts and audits.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

