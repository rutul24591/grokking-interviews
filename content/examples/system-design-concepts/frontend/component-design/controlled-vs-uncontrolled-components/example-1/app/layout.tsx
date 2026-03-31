import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Controlled vs uncontrolled components",
  description: "Choose between state-driven inputs and DOM-driven refs based on validation, scale, and synchronization requirements."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
