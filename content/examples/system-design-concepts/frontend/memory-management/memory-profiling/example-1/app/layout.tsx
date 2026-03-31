import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Memory profiling",
  description: "Compare simulated snapshots before and after cleanup so engineers can identify retained growth and validate that fixes actually work."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
