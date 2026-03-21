import Link from "next/link";
import { LocaleSchema, getMessages, t, formatCurrency, formatDateTime, plural } from "@/lib/i18n";

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = LocaleSchema.safeParse(rawLocale).success ? (rawLocale as "en" | "fr" | "ar") : "en";
  const messages = await getMessages(locale);

  const cartCount = 3;
  const totalCents = 123_456;

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{t(messages, "title")}</h1>
        <p className="text-sm text-slate-300">{t(messages, "subtitle")}</p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-2">
        <div className="text-sm text-slate-300">
          <span className="font-medium text-slate-200">{t(messages, "locale_label")}</span> {locale}
        </div>
        <div className="text-sm text-slate-300">
          <span className="font-medium text-slate-200">{t(messages, "cart_label")}</span>{" "}
          {plural(messages, "cart_items", cartCount)}
        </div>
        <div className="text-sm text-slate-300">
          <span className="font-medium text-slate-200">{t(messages, "total_label")}</span>{" "}
          {formatCurrency(locale, totalCents / 100)}
        </div>
        <div className="text-sm text-slate-300">
          <span className="font-medium text-slate-200">{t(messages, "updated_label")}</span>{" "}
          {formatDateTime(locale, new Date("2026-03-20T10:45:00Z"))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
        <h2 className="font-medium">{t(messages, "switcher_title")}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
            href="/en"
          >
            English
          </Link>
          <Link
            className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
            href="/fr"
          >
            Français
          </Link>
          <Link
            className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
            href="/ar"
          >
            العربية
          </Link>
        </div>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Staff-level gotchas</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>
            Locale negotiation must be <strong>deterministic</strong> and ideally sticky (cookie) to avoid
            redirect loops and inconsistent caches.
          </li>
          <li>
            Translation is not only strings: handle <strong>plural rules</strong>, number/date/currency
            formatting, and <strong>RTL</strong> layout for Arabic/Hebrew.
          </li>
          <li>
            Keep a fallback chain: <strong>fr-CA → fr → en</strong>.
          </li>
        </ul>
      </section>
    </main>
  );
}

