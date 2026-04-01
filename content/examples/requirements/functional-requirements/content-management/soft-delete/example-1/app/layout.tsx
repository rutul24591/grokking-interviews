import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Content Preview",
  description: "Preview drafted content across output modes before publishing."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
