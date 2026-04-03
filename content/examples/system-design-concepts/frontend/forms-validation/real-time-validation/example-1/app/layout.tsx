import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Real-time Validation",
  description: "Exercise live validator scheduling, pending states, and stale-response protection."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
