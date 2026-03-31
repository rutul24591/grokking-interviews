import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Memoization and React.memo",
  description: "Prevent expensive derived data and leaf components from re-rendering unnecessarily.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
