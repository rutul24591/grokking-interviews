import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Link from "next/link";
import { RouteHeadingFocus } from "@/components/RouteHeadingFocus";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "SPA skip targets",
  description: "Advanced skip link patterns for SPAs with sticky headers."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <RouteHeadingFocus />
        <div className="sr-only focus-within:not-sr-only">
          <div className="fixed left-4 top-4 z-50">
            <a className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-black" href="#content">
              Skip to content
            </a>
          </div>
        </div>

        <header className="sticky top-0 z-10 border-b border-white/10 bg-black/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4">
            <p className="text-sm font-semibold text-slate-100">Sticky header</p>
            <nav aria-label="Primary">
              <ul className="flex gap-4 text-sm text-slate-300">
                <li>
                  <Link className="hover:text-slate-100" href="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-slate-100" href="/a">
                    Page A
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-slate-100" href="/b">
                    Page B
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <div className="mx-auto w-full max-w-4xl px-4 py-10">{children}</div>
      </body>
    </html>
  );
}

