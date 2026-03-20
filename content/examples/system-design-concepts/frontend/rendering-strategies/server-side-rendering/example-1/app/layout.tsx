import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "SSR Reader (Example 1)",
  description: "Server-side rendering with a separate Express API.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

