import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppLayout } from "@/components/AppLayout";

const spaceGrotesk = localFont({
  variable: "--font-space-grotesk",
  display: "swap",
  src: [
    { path: "../public/fonts/sora-300.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/sora-400.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/sora-500.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/sora-600.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/sora-700.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/sora-800.ttf", weight: "800", style: "normal" },
  ],
});

const jetBrainsMono = localFont({
  variable: "--font-jetbrains-mono",
  display: "swap",
  src: [
    {
      path: "../public/fonts/fira-code-300.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/fira-code-400.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/fira-code-500.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/fira-code-600.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/fira-code-700.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "Interview Prep Studio",
  description:
    "Master system design and technical interviews with deep-dive articles, architecture diagrams, and real-world code examples.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
