import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppLayout } from "@/components/AppLayout";

const sora = localFont({
  variable: "--font-sora",
  display: "swap",
  src: [
    { path: "../public/fonts/sora-300.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/sora-400.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/sora-700.ttf", weight: "700", style: "normal" },
  ],
});

const firaCode = localFont({
  variable: "--font-fira-code",
  display: "swap",
  src: [
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
  openGraph: {
    title: "Interview Prep Studio",
    description:
      "Master system design and technical interviews with deep-dive articles, architecture diagrams, and real-world code examples.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Interview Prep Studio — Master system design interviews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interview Prep Studio",
    description:
      "Master system design and technical interviews with deep-dive articles, architecture diagrams, and real-world code examples.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sora.variable} ${firaCode.variable} antialiased`}
      >
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}

/**
 * Web Vitals reporting — logs performance metrics to console
 * in development and to your analytics provider in production.
 */
export function reportWebVitals(metric: {
  id: string;
  name: string;
  startTime: number;
  value: number;
  delta: number;
  rating: "good" | "needs-improvement" | "poor";
}) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`);
  }
  // In production, send to your analytics provider:
  // navigator.sendBeacon('/api/analytics', JSON.stringify(metric));
}
