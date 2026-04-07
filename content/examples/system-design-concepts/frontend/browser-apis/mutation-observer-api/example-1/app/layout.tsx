import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Mutation Observer API Review",
  description: "Review scoped observation, third-party widget churn, and cleanup discipline for Mutation Observer usage."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
