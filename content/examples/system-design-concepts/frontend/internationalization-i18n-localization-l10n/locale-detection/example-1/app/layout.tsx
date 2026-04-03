import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Locale Detection Console",
  description: "Review locale resolution from URL, user preference, and browser hints with persistence rules."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
