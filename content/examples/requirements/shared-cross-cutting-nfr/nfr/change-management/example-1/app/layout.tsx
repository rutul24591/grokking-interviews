import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Change Control",
  description: "Change management demo with approvals, freeze windows, and audit logs.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

