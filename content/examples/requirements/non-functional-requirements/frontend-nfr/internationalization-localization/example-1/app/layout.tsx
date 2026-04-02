import "./globals.css";
import { headers } from "next/headers";
import { localeToDir, LocaleSchema } from "@/lib/i18n";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const h = headers();
  const raw = h.get("x-locale") || "en";
  const locale = LocaleSchema.safeParse(raw).success ? (raw as "en" | "fr" | "ar") : "en";
  const dir = localeToDir(locale);

  return (
    <html lang={locale} dir={dir}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

