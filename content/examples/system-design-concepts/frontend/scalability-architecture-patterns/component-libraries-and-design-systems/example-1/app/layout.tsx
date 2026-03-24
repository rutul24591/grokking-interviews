import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Design System Demo",
    template: "%s | Design System Demo"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <header className="border-b border-[var(--border)] bg-[var(--panel-strong)]">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
            <p className="text-sm font-semibold tracking-tight text-[var(--text)]">
              <Link href="/" className="hover:underline">
                Design System
              </Link>
            </p>
            <nav aria-label="Primary">
              <ul className="flex items-center gap-4 text-sm text-[var(--muted)]">
                <li>
                  <Link className="hover:text-[var(--text)]" href="/">
                    Catalog
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-[var(--text)]" href="/checkout">
                    Checkout
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-[var(--text)]" href="/settings">
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}

