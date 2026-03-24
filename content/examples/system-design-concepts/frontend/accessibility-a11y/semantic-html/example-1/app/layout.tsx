import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Semantic HTML (a11y)",
    template: "%s | Semantic HTML (a11y)"
  },
  description: "Landmarks + structure that work for both keyboard users and screen readers."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="content" className="mx-auto w-full max-w-5xl px-4 py-10">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

