import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SkipLinkFocus } from "@/components/SkipLinkFocus";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Skip links demo",
  description: "End-to-end skip link pattern with focusable targets."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <SkipLinkFocus />
        <nav aria-label="Skip links" className="sr-only focus-within:not-sr-only">
          <ul className="fixed left-4 top-4 z-50 flex flex-col gap-2">
            <li>
              <a className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-black" href="#main">
                Skip to main content
              </a>
            </li>
            <li>
              <a className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-black" href="#search">
                Skip to search
              </a>
            </li>
            <li>
              <a className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-black" href="#footer">
                Skip to footer
              </a>
            </li>
          </ul>
        </nav>

        <header className="border-b border-white/10 bg-black/30">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
            <p className="text-sm font-semibold text-slate-100">Skip links</p>
            <nav aria-label="Primary">
              <ul className="flex items-center gap-4 text-sm text-slate-300">
                <li>
                  <a className="hover:text-slate-100" href="#main">
                    Content
                  </a>
                </li>
                <li>
                  <a className="hover:text-slate-100" href="#search">
                    Search
                  </a>
                </li>
                <li>
                  <a className="hover:text-slate-100" href="#footer">
                    Footer
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <div className="mx-auto w-full max-w-5xl px-4 py-10">{children}</div>
      </body>
    </html>
  );
}

