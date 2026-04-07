import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Notification API Review",
  description: "Review notification permission timing, urgent versus digest routing, and in-app fallback behavior for browser notifications."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
