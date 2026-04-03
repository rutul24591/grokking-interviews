import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Client-side Validation",
  description: "Exercise synchronous form validation, error summaries, and schema mismatch handling."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
