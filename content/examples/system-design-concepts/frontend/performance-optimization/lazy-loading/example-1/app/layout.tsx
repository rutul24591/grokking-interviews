import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Lazy Loading",
  description: "Load expensive widgets only when the user asks for them.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
