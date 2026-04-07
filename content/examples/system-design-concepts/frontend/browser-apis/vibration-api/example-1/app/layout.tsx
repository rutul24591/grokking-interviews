import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Vibration API Review",
  description: "Review urgent-only haptics, reduced-motion preference handling, and visible fallback cues for Vibration API usage."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
