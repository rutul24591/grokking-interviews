import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Real-time Data Updates",
  description: "Ingest live updates without flooding the visualization layer or losing temporal context."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
