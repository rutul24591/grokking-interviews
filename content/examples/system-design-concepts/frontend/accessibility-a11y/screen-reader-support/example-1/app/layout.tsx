import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AnnouncerHost } from "@/components/AnnouncerHost";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Live regions demo",
  description: "End-to-end screen reader support with polite status and alert announcements."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="mx-auto w-full max-w-4xl px-4 py-10">
        <AnnouncerHost />
        {children}
      </body>
    </html>
  );
}

