import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Atomic design principles",
  description: "Compose atoms, molecules, organisms, and templates into a production-facing interface without letting responsibilities blur across layers."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
