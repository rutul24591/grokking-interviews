import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Partial Hydration (Example 1)",
  description: "Server components + small client islands.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

