import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Cache Consistency Lab",
  description: "Invalidation vs versioned keys + stampede protection.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

