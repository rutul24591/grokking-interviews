import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "WebRTC Lab",
  description: "Review peer connection readiness, ICE health, renegotiation, and fallback behavior for peer media sessions."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
