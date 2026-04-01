import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Content Categorization UI",
  description: "Organize articles into hierarchical categories with editor-visible classification context."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
