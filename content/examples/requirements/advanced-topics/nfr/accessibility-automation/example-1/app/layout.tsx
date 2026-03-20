import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "A11y Audit Console",
  description: "Accessibility automation with axe + jsdom, baselines, and budgets.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

