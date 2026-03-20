import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "CSR Races (Example 3)",
  description: "Typeahead correctness patterns for CSR.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

