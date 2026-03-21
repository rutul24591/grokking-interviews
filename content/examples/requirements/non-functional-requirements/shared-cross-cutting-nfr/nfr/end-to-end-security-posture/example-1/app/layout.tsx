import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Secure Notes",
  description: "End-to-end security posture demo (auth, sessions, CSRF, rate limits, headers).",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

