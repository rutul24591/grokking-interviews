import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Elasticsearch Integration Lab",
  description: "Model frontend query shaping, relevance explanations, and degraded Elasticsearch response handling."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
