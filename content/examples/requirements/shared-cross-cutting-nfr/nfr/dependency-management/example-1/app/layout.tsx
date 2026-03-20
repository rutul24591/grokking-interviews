import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Dependency Governance",
  description: "Dependency management via policies, proposals, and audit trails.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

