import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Compression",
  description: "Compare raw and transferred bytes under gzip/Brotli.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

