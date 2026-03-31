import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Component composition",
  description: "Compose page sections through slots and child components so screens stay extensible without inheritance-heavy branching."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
