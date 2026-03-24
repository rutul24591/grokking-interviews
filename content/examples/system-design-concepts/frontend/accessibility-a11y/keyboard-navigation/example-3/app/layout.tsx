import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Grid keyboard navigation",
  description: "Advanced keyboard navigation: 2D grid movement."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="mx-auto w-full max-w-4xl px-4 py-10">{children}</body>
    </html>
  );
}

