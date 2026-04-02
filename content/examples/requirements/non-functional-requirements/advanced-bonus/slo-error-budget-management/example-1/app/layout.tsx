import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "SLO Lab",
  description: "A runnable SLO / error budget demo with burn-rate alerting.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

