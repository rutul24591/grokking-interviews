import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Collaborative Editing Lab",
  description: "Model operational transform style editing sessions, remote cursor flow, and conflict recovery for real-time collaborative documents."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
