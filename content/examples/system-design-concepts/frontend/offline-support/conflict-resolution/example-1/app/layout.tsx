import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conflict Resolution Workbench",
  description: "Ancestor/local/server merge visualization"
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">{props.children}</body>
    </html>
  );
}

