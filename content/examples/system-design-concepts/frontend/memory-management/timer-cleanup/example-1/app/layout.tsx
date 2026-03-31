import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Timer cleanup",
  description: "Mount and unmount timer-driven widgets without leaving orphaned intervals or pending callbacks behind."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
