import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Code Splitting",
  description: "Split heavy functionality where the user intent changes.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

