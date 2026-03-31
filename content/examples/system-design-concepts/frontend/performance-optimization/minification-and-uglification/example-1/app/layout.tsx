import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Minification and Uglification",
  description: "Bundle report dashboard for production build output.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
