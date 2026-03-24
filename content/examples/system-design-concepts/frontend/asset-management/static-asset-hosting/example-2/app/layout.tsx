import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Static Asset Hosting (Example 2)",
  description: "Signed URL primitives in isolation.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

