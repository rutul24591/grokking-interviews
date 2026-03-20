import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Islands on Visibility (Example 2)",
  description: "Load/hydrate islands when visible.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

