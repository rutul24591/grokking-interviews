import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Compound components",
  description: "Coordinate multiple child components through shared context so APIs stay expressive without prop overload."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
