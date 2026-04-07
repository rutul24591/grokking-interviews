import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Blue-Green Deployment Review",
  description: "Review environment parity, traffic cutover readiness, and rollback posture before promoting the green stack."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
