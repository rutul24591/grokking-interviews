import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Requirements Example",
  description: "Runnable example for a functional requirement topic."
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
