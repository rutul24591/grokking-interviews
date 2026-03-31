import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Smart vs dumb components",
  description: "Separate data orchestration from presentation so UI stays reusable and side effects stay centralized."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
