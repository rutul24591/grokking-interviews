import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "App-like Experience PWA Lab",
  description: "Review installability, offline shell behavior, and re-engagement for an app-like mobile web experience."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
