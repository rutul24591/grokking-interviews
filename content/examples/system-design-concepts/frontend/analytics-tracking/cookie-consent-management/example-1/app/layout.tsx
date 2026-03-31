import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Cookie consent management",
  description: "Persist consent categories, gate analytics in the browser, and reconcile consent version changes without losing regulatory control."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
