import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Render props",
  description: "Share reusable behavior through render callbacks when consumers need custom rendering over the same state machine."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
