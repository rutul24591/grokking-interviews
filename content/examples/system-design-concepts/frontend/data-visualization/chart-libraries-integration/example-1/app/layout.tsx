import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Chart Libraries Integration",
  description: "Integrate backend-fed chart data through a normalized chart adapter."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
