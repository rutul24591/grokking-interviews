import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Zero Downtime Deployment Review",
  description: "Review asset compatibility, cache safety, and release sequencing needed to deliver a frontend without visible downtime."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
