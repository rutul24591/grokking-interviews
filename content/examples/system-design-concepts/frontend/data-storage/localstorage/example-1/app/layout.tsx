import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LocalStorage draft persistence",
  description: "SSR-safe draft persistence and preference storage"
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

