import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Webpack, Vite, Rollup Configuration Review",
  description: "Review bundler choices, plugin boundaries, and production build safety for Webpack, Vite, or Rollup based frontends."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
