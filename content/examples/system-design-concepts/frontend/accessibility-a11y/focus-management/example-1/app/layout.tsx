import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { RouteFocusManager } from "@/components/RouteFocusManager";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Route Focus Demo",
    template: "%s | Route Focus Demo"
  }
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
        <RouteFocusManager />
        <header className="border-b border-white/10 bg-black/30">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
            <p className="text-sm font-semibold tracking-tight text-slate-100">Focus management</p>
            <nav aria-label="Primary">
              <ul className="flex items-center gap-4 text-sm text-slate-300">
                <li>
                  <a className="hover:text-slate-100" href="/">
                    Home
                  </a>
                </li>
                <li>
                  <a className="hover:text-slate-100" href="/inbox">
                    Inbox
                  </a>
                </li>
                <li>
                  <a className="hover:text-slate-100" href="/settings">
                    Settings
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main id="content" className="mx-auto w-full max-w-5xl px-4 py-10">
          {children}
        </main>
        <footer className="border-t border-white/10 bg-black/30">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 text-sm text-slate-300">
            Focus should move to the page heading on navigation, not stay on the previous link.
          </div>
        </footer>
      </body>
    </html>
  );
}

