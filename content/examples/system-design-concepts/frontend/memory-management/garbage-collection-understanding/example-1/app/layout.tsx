import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Garbage collection understanding",
  description: "Visualize reachability and retained references so frontend engineers can reason about what becomes collectible and what stays alive."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
