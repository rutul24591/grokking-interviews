import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Content Sharing Interface",
  description: "Distribute content across channels with share state, audience, and fallback handling."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
