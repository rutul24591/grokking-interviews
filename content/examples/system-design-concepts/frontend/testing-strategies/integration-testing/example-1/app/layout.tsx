import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Integration Testing Review",
  description: "Review frontend integration tests for boundary coverage, contract safety, and release readiness."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
