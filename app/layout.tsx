import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { readFile } from "node:fs/promises";
import path from "node:path";
import "./globals.css";
import { AppLayout } from "@/components/AppLayout";
import { parseFrontendConcepts } from "@/lib/parseFrontendConcepts";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
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

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased`}>
        <AppLayout frontendSubCategories={frontendSubCategories}>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
