import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Unit Testing Review",
  description: "Review isolated frontend unit test coverage, determinism, and regression posture."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
