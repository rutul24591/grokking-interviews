import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Touch vs Pointer Events Lab",
  description: "Review touch and pointer event handling, gesture fallback, and duplicate event suppression on mobile browsers."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
