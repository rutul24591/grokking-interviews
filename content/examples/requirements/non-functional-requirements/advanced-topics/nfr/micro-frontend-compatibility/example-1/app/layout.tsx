import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Micro-frontend Compatibility",
  description: "Host + versioned contract + remote custom-element microfrontends.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

