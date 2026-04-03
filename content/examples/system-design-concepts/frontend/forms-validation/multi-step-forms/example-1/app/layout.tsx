import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Multi-step Forms",
  description: "Exercise step gating, progress persistence, and summary integrity in multi-step forms."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
