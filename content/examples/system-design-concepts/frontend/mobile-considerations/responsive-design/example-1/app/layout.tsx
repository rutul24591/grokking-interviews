import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Responsive Design Workbench",
  description: "Review breakpoint-specific layout behavior, adaptive content density, and interaction safety across mobile screens."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
