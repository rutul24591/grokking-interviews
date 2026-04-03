import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Date Time and Number Formatting Console",
  description: "Review locale-specific date, time, and numeric presentation with timezone and fallback rules."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
