import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Undo/Redo Functionality - Example 1: Reversible editor history",
  description: "Undo/Redo Functionality — Example 1"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
