import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Event listener cleanup",
  description: "Attach and remove global listeners predictably so panels can mount and unmount without stacking duplicate handlers."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
