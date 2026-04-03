import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Device Orientation Console",
  description: "Review orientation sensor handling, permission states, and responsive fallbacks for mobile gestures."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
