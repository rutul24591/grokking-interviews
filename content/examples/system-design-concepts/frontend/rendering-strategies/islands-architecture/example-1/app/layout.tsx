import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Islands Architecture (Example 1)",
  description: "Server shell + client islands.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

