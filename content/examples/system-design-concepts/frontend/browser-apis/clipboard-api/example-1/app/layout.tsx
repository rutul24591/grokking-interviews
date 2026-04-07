import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Clipboard API Review",
  description: "Review clipboard write permission, explicit confirmation for sensitive values, and manual fallbacks for unsupported browsers."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
