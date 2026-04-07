import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Web Animations API Review",
  description: "Review animation handle lifecycles, off-screen pausing, and runaway timeline prevention for Web Animations API usage."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
