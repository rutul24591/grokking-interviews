import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "CSR Perf (Example 2)",
  description: "Virtualization and deferred input for CSR performance.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

