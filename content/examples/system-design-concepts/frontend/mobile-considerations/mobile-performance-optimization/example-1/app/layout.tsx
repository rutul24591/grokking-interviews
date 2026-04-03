import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Mobile Performance Console",
  description: "Review CPU, memory, and interaction constraints on mobile devices with adaptive feature budgets."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
