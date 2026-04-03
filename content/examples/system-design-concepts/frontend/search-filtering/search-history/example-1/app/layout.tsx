import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Search History Lab",
  description: "Model recent query storage, deduplication, privacy boundaries, and reuse behavior for search history."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
