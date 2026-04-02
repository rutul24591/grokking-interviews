import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Memory Lab",
  description: "Memory-management demo: leak vs bounded cache, observable via process.memoryUsage().",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

