import { z } from "zod";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import ar from "@/messages/ar.json";

export const SUPPORTED_LOCALES = ["en", "fr", "ar"] as const;
export const LocaleSchema = z.enum(SUPPORTED_LOCALES);
export type Locale = z.infer<typeof LocaleSchema>;

type Plurals = { one: string; other: string };

export type Messages = {
  title: string;
  subtitle: string;
  locale_label: string;
  cart_label: string;
  total_label: string;
  updated_label: string;
  switcher_title: string;
  cart_items: Plurals;
};

const MESSAGES: Record<Locale, Messages> = { en, fr, ar } as unknown as Record<Locale, Messages>;

export async function getMessages(locale: Locale): Promise<Messages> {
  return MESSAGES[locale] || MESSAGES.en;
}

export function t(messages: Messages, key: keyof Omit<Messages, "cart_items">) {
  return messages[key];
}

export function plural(messages: Messages, key: "cart_items", count: number) {
  const rules = new Intl.PluralRules("en"); // simple two-form demo (one/other)
  const form = rules.select(count) === "one" ? "one" : "other";
  return messages[key][form].replace("{count}", String(count));
}

export function localeToDir(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function formatCurrency(locale: Locale, value: number) {
  const currency = locale === "fr" ? "EUR" : locale === "ar" ? "AED" : "USD";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);
}

export function formatDateTime(locale: Locale, value: Date) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(value);
}

type LangPref = { tag: string; q: number };

export function negotiateLocale(acceptLanguage: string): Locale | null {
  const prefs: LangPref[] = acceptLanguage
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [tag, ...params] = part.split(";").map((x) => x.trim());
      const q = params.find((p) => p.startsWith("q="));
      const qv = q ? Number(q.slice(2)) : 1;
      return { tag: tag.toLowerCase(), q: Number.isFinite(qv) ? qv : 0 };
    })
    .sort((a, b) => b.q - a.q);

  for (const p of prefs) {
    const base = p.tag.split("-")[0] || p.tag;
    if (LocaleSchema.safeParse(p.tag).success) return p.tag as Locale;
    if (LocaleSchema.safeParse(base).success) return base as Locale;
  }
  return null;
}

