import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Higher-order components",
  description: "Wrap shared behavior like entitlement checks and audit logging around base components without duplicating cross-cutting logic."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
