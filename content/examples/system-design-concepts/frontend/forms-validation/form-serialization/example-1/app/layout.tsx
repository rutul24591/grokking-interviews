import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Form Serialization",
  description: "Exercise serialization of nested frontend form state into API-friendly payloads."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
