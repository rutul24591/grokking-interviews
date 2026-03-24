import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Semantic UI Patterns",
    template: "%s | Semantic UI Patterns"
  },
  description: "Advanced semantic HTML patterns for SEO beyond blog-article pages."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="mx-auto w-full max-w-5xl px-4 py-10">{children}</body>
    </html>
  );
}

