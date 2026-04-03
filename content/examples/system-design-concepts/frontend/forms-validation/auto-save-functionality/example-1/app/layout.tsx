import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Auto-save Functionality",
  description: "Model autosave timing, dirty-state protection, and draft recovery for production forms."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
