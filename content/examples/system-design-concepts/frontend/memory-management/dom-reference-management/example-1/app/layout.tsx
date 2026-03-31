import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "DOM reference management",
  description: "Track dynamic DOM refs for an article workspace so focus, measurement, and cleanup remain accurate as sections mount, reorder, and unmount."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
