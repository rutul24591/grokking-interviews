import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Lazy Loading Translations Console",
  description: "Review route-level translation loading, preload decisions, and fallback behavior for missing bundles."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
