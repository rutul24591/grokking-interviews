import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Custom dimensions and metrics",
  description: "Capture richer analytics context without exploding cardinality or letting arbitrary client fields poison reporting."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
