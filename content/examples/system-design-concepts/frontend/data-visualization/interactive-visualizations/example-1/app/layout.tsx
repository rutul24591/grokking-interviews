import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Interactive Visualizations",
  description: "Support drilldowns, hover, and selection state without losing analytical context."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
