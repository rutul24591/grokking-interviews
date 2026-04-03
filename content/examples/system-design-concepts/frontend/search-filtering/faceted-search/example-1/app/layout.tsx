import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Faceted Search Lab",
  description: "Model multi-facet filtering, count recomputation, and zero-result recovery for faceted search UIs."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
