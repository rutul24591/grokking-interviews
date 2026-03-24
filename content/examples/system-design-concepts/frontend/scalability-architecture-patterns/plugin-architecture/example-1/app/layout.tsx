import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Plugin host",
  description: "End-to-end plugin architecture demo with a stable plugin contract."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="mx-auto w-full max-w-6xl px-4 py-10">{children}</body>
    </html>
  );
}

