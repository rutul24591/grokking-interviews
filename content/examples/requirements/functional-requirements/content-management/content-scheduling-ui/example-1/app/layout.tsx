import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Content Scheduling UI",
  description: "Schedule content release windows, publication timing, and editorial readiness."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
