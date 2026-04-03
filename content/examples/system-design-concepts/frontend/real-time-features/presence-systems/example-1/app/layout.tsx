import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Presence Systems Lab",
  description: "Model active, idle, and stale presence state for collaborative or chat surfaces."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
