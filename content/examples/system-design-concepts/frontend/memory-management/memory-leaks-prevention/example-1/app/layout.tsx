import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Memory leaks prevention",
  description: "Model common leak sources together so engineers can see how timers, caches, listeners, and detached data accumulate over long sessions."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
