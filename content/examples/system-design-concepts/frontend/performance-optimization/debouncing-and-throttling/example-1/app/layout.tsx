import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Debouncing and Throttling",
  description: "Search UX with debounced requests and throttled telemetry.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
