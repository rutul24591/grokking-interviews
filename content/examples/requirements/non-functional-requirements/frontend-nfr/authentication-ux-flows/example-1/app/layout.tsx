import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Auth UX Simulator",
  description: "Frontend NFR: authentication UX flows + step-up authentication.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

