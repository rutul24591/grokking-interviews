import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Mobile Network Console",
  description: "Review slow network behavior, asset deferral, and degraded data strategies for mobile sessions."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
