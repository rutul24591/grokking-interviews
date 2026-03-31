import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Event tracking",
  description: "Model browser-side event queues, contract validation, and deduplication so interaction telemetry stays accurate under real user traffic."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
