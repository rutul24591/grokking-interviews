import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Feature Flags Demo",
    template: "%s | Feature Flags Demo"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <header className="border-b border-white/10 bg-black/30">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
            <p className="text-sm font-semibold text-slate-100">Feature Flags</p>
            <nav aria-label="Primary">
              <ul className="flex items-center gap-4 text-sm text-slate-300">
                <li>
                  <Link className="hover:text-slate-100" href="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-slate-100" href="/admin">
                    Admin
                  </Link>
                </li>
                <li>
                  <a className="hover:text-slate-100" href="/api/flags">
                    /api/flags
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 py-10">{children}</main>
        <footer className="border-t border-white/10 bg-black/30">
          <div className="mx-auto w-full max-w-5xl px-4 py-8 text-sm text-slate-300">
            Server-driven evaluation avoids “flicker” and keeps rollout behavior deterministic.
          </div>
        </footer>
      </body>
    </html>
  );
}

