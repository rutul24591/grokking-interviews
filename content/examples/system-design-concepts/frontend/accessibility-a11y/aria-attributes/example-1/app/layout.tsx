import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "ARIA Tabs demo",
  description: "End-to-end accessible tabs using ARIA roles and attributes."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="mx-auto w-full max-w-5xl px-4 py-10">{children}</body>
    </html>
  );
}

