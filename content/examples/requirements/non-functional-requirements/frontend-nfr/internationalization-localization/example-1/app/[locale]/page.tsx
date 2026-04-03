import Link from "next/link";
import { LocaleSchema, getMessages, t, formatCurrency, formatDateTime, plural } from "@/lib/i18n";
import { ReviewNote } from "../../components/ReviewNote";

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
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Decision rubric</h2>
          <p className="mt-1 text-sm text-slate-400">
            Use this rubric to judge whether internationalization localization is ready for production review. The point is not simply to see a
            successful response, but to confirm the example explains the operational tradeoffs that senior engineers
            would debate during design review, rollout approval, or incident response.
          </p>
          <p className="mt-3 text-sm text-slate-400">
            A strong non-functional example should make the protection boundary, the degraded path, and the operator's
            next safe action obvious. If those three things are hidden, the workflow is still too shallow.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Primary signal"
            detail="For internationalization localization, verify that the UI exposes the one or two signals an operator would trust first when deciding whether the system is healthy."
          />
          <ReviewNote
            title="Safe fallback"
            detail="For internationalization localization, validate that the fallback path is explicit, bounded, and consistent with the business priority rather than an accidental side effect."
          />
          <ReviewNote
            title="Review evidence"
            detail="For internationalization localization, confirm that the output is detailed enough for another engineer to audit the behavior without re-running the scenario from scratch."
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
            <div className="font-semibold text-white">Questions to ask in review</div>
            <ul className="mt-3 space-y-2 text-slate-400">
              <li>• What fails first when demand, latency, or invalid input spikes?</li>
              <li>• Which state transitions are safe to retry and which require human intervention?</li>
              <li>• How does the operator know the fallback reduced risk instead of hiding it?</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
            <div className="font-semibold text-white">Why this matters for Internationalization Localization</div>
            <p className="mt-3">
              These checks push the example beyond a static demo. They turn it into a review artifact that teaches the
              production contract, the recovery posture, and the evidence needed to defend the design under scrutiny.
            </p>
          </div>
        </div>
      </section>

</main>
  );
}

