import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Asset Versioning (Example 3)",
  description: "Conditional requests with ETag and If-None-Match.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

