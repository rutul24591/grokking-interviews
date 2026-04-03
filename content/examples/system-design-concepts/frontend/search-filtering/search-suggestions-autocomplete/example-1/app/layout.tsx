import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Search Suggestions & Autocomplete Lab",
  description: "Model suggestion ranking, keyboard navigation, and stale-suggestion handling for autocomplete search boxes."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
