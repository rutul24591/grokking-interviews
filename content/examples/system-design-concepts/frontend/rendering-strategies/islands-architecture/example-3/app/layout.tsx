import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Islands: Big Props vs Id-only (Example 3)",
  description: "Avoid large prop serialization across server/client boundaries.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

