import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "ISR Time-Based (Example 1)",
  description: "Revalidation every N seconds.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

