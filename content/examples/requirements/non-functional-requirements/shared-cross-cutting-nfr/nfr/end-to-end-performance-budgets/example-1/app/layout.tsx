import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Performance Budget Gate",
  description: "Budgeted percentiles and a pass/fail gate.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

