import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Large Dataset Rendering",
  description: "Window, aggregate, and downsample large series before visualizing them."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
