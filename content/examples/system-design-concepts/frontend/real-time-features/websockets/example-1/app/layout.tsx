import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "WebSockets Lab",
  description: "Review bidirectional connection health, subscription routing, and reconnect handling for WebSocket-powered apps."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
