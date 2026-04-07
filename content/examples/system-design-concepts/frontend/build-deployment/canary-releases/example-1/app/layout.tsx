import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Canary Releases Review",
  description: "Review traffic weights, cohort safety, and automated halt conditions for frontend canary releases."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
