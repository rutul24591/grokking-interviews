import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Versioned API",
  description: "Backward compatibility via adapters and deprecation signaling.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

