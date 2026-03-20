import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Edge Sessions (Example 3)",
  description: "Signed cookie session using Web Crypto.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

