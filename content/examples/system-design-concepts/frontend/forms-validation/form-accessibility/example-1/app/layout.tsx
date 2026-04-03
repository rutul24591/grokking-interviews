import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Form Accessibility",
  description: "Exercise accessible form structure, error announcements, and keyboard-safe flows."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
