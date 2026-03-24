import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "ARIA expanded/controls demo",
  description: "Advanced ARIA attributes: aria-expanded, aria-controls, and menu button semantics."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="mx-auto w-full max-w-3xl px-4 py-10">{children}</body>
    </html>
  );
}

