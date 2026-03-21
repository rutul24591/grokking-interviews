import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { LocaleSchema, formatCurrency, formatDateTime, localeToDir, negotiateLocale, type Locale } from "@/lib/i18n";

function pickLocale(req: NextRequest, explicit: string | null) {
  if (explicit) {
    const parsed = LocaleSchema.safeParse(explicit);
    if (parsed.success) return { locale: parsed.data, source: "query" as const };
  }

  const cookieLocale = req.cookies.get("locale")?.value || null;
  if (cookieLocale) {
    const parsed = LocaleSchema.safeParse(cookieLocale);
    if (parsed.success) return { locale: parsed.data, source: "cookie" as const };
  }

  const accept = req.headers.get("accept-language") || "";
  const negotiated = accept ? negotiateLocale(accept) : null;
  if (negotiated) return { locale: negotiated, source: "accept-language" as const };

  return { locale: "en" as Locale, source: "default" as const };
}

function numberFromParam(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function dateFromParam(value: string | null, fallback: Date) {
  if (!value) return fallback;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : fallback;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const { locale, source } = pickLocale(req, url.searchParams.get("locale"));
  const amount = numberFromParam(url.searchParams.get("amount"), 1234.56);
  const ts = dateFromParam(url.searchParams.get("ts"), new Date("2026-03-20T00:00:00Z"));

  return NextResponse.json(
    {
      locale,
      dir: localeToDir(locale),
      source,
      amount: formatCurrency(locale, amount),
      updatedAt: formatDateTime(locale, ts),
    },
    {
      headers: {
        // This endpoint depends on locale negotiation and/or cookies.
        Vary: "Accept-Language, Cookie",
        "Cache-Control": "no-store",
      },
    }
  );
}

