import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Progressive Hydration Hooks (Example 2)",
  description: "Reusable idle/visible hooks.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

