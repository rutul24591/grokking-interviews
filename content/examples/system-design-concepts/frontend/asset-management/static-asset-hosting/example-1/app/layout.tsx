import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Static Asset Hosting (Example 1)",
  description: "Public vs private assets with signed URLs.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

