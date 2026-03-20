import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "SSR Hydration (Example 3)",
  description: "Hydration mismatch pitfalls and fixes.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

