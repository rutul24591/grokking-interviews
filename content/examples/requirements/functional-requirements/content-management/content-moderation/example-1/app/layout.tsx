import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Content Moderation",
  description: "Review flagged content, apply moderator decisions, and preserve moderation rationale."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
