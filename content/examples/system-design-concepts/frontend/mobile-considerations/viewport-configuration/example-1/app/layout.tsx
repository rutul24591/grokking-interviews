import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Viewport Configuration Console",
  description: "Review viewport meta behavior, zoom safety, and layout fit decisions on mobile browsers."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
