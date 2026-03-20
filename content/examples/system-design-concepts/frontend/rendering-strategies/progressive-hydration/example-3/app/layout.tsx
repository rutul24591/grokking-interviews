import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Progressive Hydration Scheduling (Example 3)",
  description: "Cancellation + deduplication for progressive hydration.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

