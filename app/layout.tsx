import type { Metadata } from "next";
import localFont from "next/font/local";
import { readFile } from "node:fs/promises";
import path from "node:path";
import "./globals.css";
import { AppLayout } from "@/components/AppLayout";
import { parseBackendConcepts } from "@/lib/parseBackendConcepts";
import { parseFrontendConcepts } from "@/lib/parseFrontendConcepts";

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
    { path: "../public/fonts/fira-code-300.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/fira-code-400.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/fira-code-500.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/fira-code-600.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/fira-code-700.ttf", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Interview Prep Studio",
  description: "A scalable interview preparation knowledge platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const frontendConceptsPath = path.join(
    process.cwd(),
    "concepts",
    "frontend-concepts.txt",
  );
  const frontendConceptsRaw = await readFile(frontendConceptsPath, "utf8");
  const frontendSubCategories = parseFrontendConcepts(frontendConceptsRaw);
  const backendConceptsPath = path.join(
    process.cwd(),
    "concepts",
    "backend-concepts.txt",
  );
  const backendConceptsRaw = await readFile(backendConceptsPath, "utf8");
  const backendSubCategories = parseBackendConcepts(backendConceptsRaw);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased`}>
        <AppLayout
          frontendSubCategories={frontendSubCategories}
          backendSubCategories={backendSubCategories}
        >
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
