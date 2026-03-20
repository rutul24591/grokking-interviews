import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Progressive Hydration (Example 1)",
  description: "Idle + visibility progressive loading for islands.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

