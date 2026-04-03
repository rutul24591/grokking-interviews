import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Full-Text Search Libraries Lab",
  description: "Compare frontend full-text libraries, fuzzy matching modes, and weighted-field behavior."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
