import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Rollback Strategies Review",
  description: "Review rollback triggers, revert speed, and customer-visible safety nets for frontend deployments."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
