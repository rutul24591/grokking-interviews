import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Component lifecycle optimization",
  description: "Control mount, cleanup, and async work so interactive components stay fast and leak-free under frequent visibility changes."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
