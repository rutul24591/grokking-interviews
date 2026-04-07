import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Feature Flags for Gradual Rollout Review",
  description: "Review flag ownership, targeting rules, and safe rollback behavior for frontend gradual rollouts."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
