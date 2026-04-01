import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Content Lifecycle Management",
  description: "Track content through draft, review, publish, archive, and retirement states."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
