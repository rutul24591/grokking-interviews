import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Search Debouncing Lab",
  description: "Model debounced query execution, cancellation, and stale-response handling for live search UIs."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
