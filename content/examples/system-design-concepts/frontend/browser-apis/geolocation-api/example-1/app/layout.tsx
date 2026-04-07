import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Geolocation API Review",
  description: "Review permission prompts, coarse versus precise location, and manual fallback routing for geolocation-dependent features."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
