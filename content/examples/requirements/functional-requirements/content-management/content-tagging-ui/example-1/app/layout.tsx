import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Content Tagging UI",
  description: "Manage tag assignment, editorial consistency, and tag quality before content goes live."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
