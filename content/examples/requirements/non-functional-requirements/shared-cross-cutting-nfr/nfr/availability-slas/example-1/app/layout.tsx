import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "SLA Lab",
  description: "Composite availability calculator with downtime and simulation.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

