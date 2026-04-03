"use client";

import { useMemo, useState } from "react";
import { currencyCatalog, currencyPolicies } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [browseLocale, setBrowseLocale] = useState("en-US");
  const [settlementCurrency, setSettlementCurrency] = useState("USD");
  const entry = currencyCatalog[selected];

  const formatted = useMemo(() => new Intl.NumberFormat(browseLocale, { style: "currency", currency: entry.currency }).format(entry.amount), [browseLocale, entry]);
  const warning = useMemo(() => {
    if (settlementCurrency !== entry.currency) return `Settlement stays in ${settlementCurrency} while display uses ${entry.currency}. Add conversion disclosure.`;
    if (browseLocale !== entry.locale) return `User locale changed to ${browseLocale}. Preserve billing currency and adjust separators only.`;
    return "Display formatting and settlement currency are aligned.";
  }, [browseLocale, settlementCurrency, entry]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Frontend i18n/l10n</p>
        <h1 className="mt-2 text-3xl font-semibold">Currency formatting console</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Compare localized price displays against billing and settlement constraints.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {currencyCatalog.map((item, index) => <option key={item.product} value={index}>{item.product}</option>)}
            </select>
            <div className="grid gap-4 md:grid-cols-2">
              <select value={browseLocale} onChange={(event) => setBrowseLocale(event.target.value)} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                <option value="en-US">en-US</option>
                <option value="de-DE">de-DE</option>
                <option value="ja-JP">ja-JP</option>
              </select>
              <select value={settlementCurrency} onChange={(event) => setSettlementCurrency(event.target.value)} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Localized display</div>
              <div className="mt-2 text-3xl font-semibold text-slate-100">{formatted}</div>
              <p className="mt-2 text-slate-400">Original product locale: {entry.locale} · Billing currency: {entry.currency}</p>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Risk review</div>
              <p className="mt-2">{warning}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Policies</div>
              <ul className="mt-2 space-y-2">{currencyPolicies.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
