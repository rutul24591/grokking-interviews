import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Streaming SSR (Example 1)",
  description: "Streaming SSR with Suspense boundaries.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

