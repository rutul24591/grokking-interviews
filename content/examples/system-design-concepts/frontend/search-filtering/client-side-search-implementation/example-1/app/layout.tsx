import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Client-Side Search Implementation Lab",
  description: "Model local indexing, in-browser ranking, and large in-memory result handling for client-side search."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
