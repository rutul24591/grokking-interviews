import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "User journey tracking",
  description: "Stitch ordered journey steps across a session so product teams see where expert users branch, stall, or abandon the research workflow."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
