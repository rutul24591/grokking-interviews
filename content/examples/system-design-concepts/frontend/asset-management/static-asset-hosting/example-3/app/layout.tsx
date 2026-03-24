import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Static Asset Hosting (Example 3)",
  description: "Range requests and partial content for large assets.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

