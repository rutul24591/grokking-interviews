import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <div className="mx-auto max-w-4xl px-6 py-10">{children}</div>
      </body>
    </html>
  );
}

