import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Currency Formatting Console",
  description: "Review locale-aware currency formatting, fallback decisions, and price display risk handling."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
