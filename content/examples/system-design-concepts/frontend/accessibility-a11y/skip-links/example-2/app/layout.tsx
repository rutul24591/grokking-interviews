import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SkipLink } from "@/components/SkipLink";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "SkipLink component",
  description: "Focused demo: reusable SkipLink component and skip targets with scroll-margin."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <div className="sr-only focus-within:not-sr-only">
          <div className="fixed left-4 top-4 z-50 flex gap-2">
            <SkipLink targetId="content">Skip to content</SkipLink>
            <SkipLink targetId="help">Skip to help</SkipLink>
          </div>
        </div>

        <header className="sticky top-0 z-10 border-b border-white/10 bg-black/80 backdrop-blur">
          <div className="mx-auto w-full max-w-4xl px-4 py-4">
            <p className="text-sm font-semibold text-slate-100">Sticky header</p>
          </div>
        </header>

        <div className="mx-auto w-full max-w-4xl px-4 py-10">{children}</div>
      </body>
    </html>
  );
}

