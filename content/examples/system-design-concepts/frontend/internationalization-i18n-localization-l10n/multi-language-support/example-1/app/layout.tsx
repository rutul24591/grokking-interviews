import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Multi Language Support Console",
  description: "Review language switching, translated navigation, and cross-locale content completeness."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
