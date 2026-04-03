"use client";

import { useMemo, useState } from "react";
import { languagePolicies, languageViews } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [showFallbackBanner, setShowFallbackBanner] = useState(true);
  const view = languageViews[selected];

  const message = useMemo(() => {
    if (view.coverage < 80) return `Locale ${view.locale} is below launch coverage. Keep example tabs behind a fallback banner.`;
    if (view.coverage < 100) return `Locale ${view.locale} can ship with a translated shell and targeted content fallbacks.`;
    return `Locale ${view.locale} is ready for full article and example navigation.`;
  }, [view]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-violet-300">Frontend i18n/l10n</p>
        <h1 className="mt-2 text-3xl font-semibold">Multi-language support console</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {languageViews.map((item, index) => <option key={item.locale} value={index}>{item.locale.toUpperCase()}</option>)}
            </select>
            <label className="flex items-center gap-3"><input type="checkbox" checked={showFallbackBanner} onChange={(event) => setShowFallbackBanner(event.target.checked)} /> Show fallback banner for partial locales</label>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Current title</div>
              <p className="mt-2 text-xl font-semibold text-slate-100">{view.articleTitle}</p>
              <p className="mt-2 text-slate-400">Coverage: {view.coverage}%</p>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Launch decision</div>
              <p className="mt-2">{message}</p>
              <p className="mt-2">Fallback banner: {showFallbackBanner ? "enabled" : "disabled"}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Policies</div>
              <ul className="mt-2 space-y-2">{languagePolicies.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
