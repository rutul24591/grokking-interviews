import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Service Workers Review",
  description: "Review cache versioning, waiting-update prompts, and offline fallback safety for service worker powered features."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
