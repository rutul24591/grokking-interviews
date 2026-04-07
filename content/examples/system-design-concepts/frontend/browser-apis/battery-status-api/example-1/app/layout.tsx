import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Battery Status API Review",
  description: "Review how the app lowers polling, disables non-essential animation, and preserves a battery-safe fallback when battery signals are weak or unavailable."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
