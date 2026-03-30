import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Error States - Example 1: Recovery-first incident panel",
  description: "Error States — Example 1"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
