import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Broadcast Channel API Review",
  description: "Review leader election, unsent cross-tab work, and stale-tab quarantine for Broadcast Channel based coordination."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
