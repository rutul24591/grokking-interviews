import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "CSR Reader (Example 1)",
  description: "Client-Side Rendering example with a separate API server.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

