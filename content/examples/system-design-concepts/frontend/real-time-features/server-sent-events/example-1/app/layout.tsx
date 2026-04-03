import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Server-Sent Events Lab",
  description: "Review one-way server streams, reconnection strategy, and replay cursor handling for SSE-driven interfaces."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
