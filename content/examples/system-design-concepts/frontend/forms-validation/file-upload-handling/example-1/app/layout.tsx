import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "File Upload Handling",
  description: "Model client-side file acceptance, queue state, and recovery paths for uploads."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
