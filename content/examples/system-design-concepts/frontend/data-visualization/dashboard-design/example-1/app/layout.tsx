import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Dashboard Design",
  description: "Coordinate KPIs, panels, layout priorities, and degraded states in a data-heavy dashboard."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
