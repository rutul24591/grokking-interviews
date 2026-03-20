import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Partial Hydration Pitfalls (Example 3)",
  description: "Client boundary explosion vs leaf islands.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

