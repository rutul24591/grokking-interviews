import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Form State Management",
  description: "Exercise local state, derived state, save modes, and reset safety for large forms."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
