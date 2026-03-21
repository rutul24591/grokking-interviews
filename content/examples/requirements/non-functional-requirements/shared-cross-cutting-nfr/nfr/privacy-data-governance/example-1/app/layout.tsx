import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Privacy Gateway",
  description: "Purpose-based access + audit logging + DSAR deletion.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

