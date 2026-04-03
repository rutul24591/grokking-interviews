import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Live Updates Feed Lab",
  description: "Review live event feeds, batching, backlog visibility, and recovery when stream freshness degrades."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
