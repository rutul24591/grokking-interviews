import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Resize Observer API Review",
  description: "Review resize-driven layouts, redraw budgets, and protection against resize feedback loops."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
