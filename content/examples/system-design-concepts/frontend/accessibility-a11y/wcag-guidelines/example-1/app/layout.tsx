import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "WCAG audit panel",
  description: "End-to-end WCAG-inspired checks run against a UI subtree."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="mx-auto w-full max-w-6xl px-4 py-10">{children}</body>
    </html>
  );
}

