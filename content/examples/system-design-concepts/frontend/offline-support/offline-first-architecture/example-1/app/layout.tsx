import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline-First Example",
  description: "IndexedDB + outbox + idempotent sync API in Next.js"
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">{props.children}</body>
    </html>
  );
}

