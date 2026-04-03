import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Real-time Notifications Lab",
  description: "Model notification inbox freshness, delivery urgency, and safe fallbacks when push or in-app channels degrade."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
