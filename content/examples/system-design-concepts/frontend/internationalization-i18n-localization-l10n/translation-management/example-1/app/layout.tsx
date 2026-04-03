import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Translation Management Console",
  description: "Review translation key lifecycle, review status, and missing-key handling across locales."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
