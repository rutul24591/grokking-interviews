import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "RTL Support Console",
  description: "Review right-to-left layout switching, mirrored controls, and mixed-direction content handling."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
