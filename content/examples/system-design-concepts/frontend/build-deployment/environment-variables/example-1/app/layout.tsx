import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Environment Variables Review",
  description: "Review public-versus-secret variable boundaries, build-time injection, and configuration drift across environments."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
