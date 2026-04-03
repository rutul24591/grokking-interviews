import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Mobile First Design Studio",
  description: "Review content prioritization, breakpoint escalation, and touch-safe composition from a mobile-first baseline."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
