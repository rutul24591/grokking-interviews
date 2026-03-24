import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Semantic inspector",
  description: "Focused a11y demo: inspect headings and landmarks based on semantics."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="mx-auto w-full max-w-5xl px-4 py-10">{children}</body>
    </html>
  );
}

