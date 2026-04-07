import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Shared Workers Review",
  description: "Review shared background queues, idle-port pruning, and fallback behavior for Shared Worker based coordination."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
