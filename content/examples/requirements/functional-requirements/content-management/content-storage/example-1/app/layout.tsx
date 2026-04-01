import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Content Storage",
  description: "Map content classes to the right storage tier and retention policy."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
