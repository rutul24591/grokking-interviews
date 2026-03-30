import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Animation Transitions Example 1",
  description: "Runnable Next.js example for a frontend animation topic"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
