import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "ISR On-demand (Example 2)",
  description: "On-demand revalidation via revalidateTag.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

