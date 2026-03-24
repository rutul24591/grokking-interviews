import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Asset Versioning & Cache Busting (Example 1)",
  description: "Filename hashing + immutable caching with an asset manifest.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

