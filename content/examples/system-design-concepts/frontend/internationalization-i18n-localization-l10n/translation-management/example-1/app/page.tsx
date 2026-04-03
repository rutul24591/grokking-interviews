"use client";

import { useMemo, useState } from "react";
import { translationKeys, translationPolicies } from "@/lib/store";

export default function Page() {
  const [locale, setLocale] = useState("fr");
  const [releaseBlocking, setReleaseBlocking] = useState(true);
  const [showExampleTab, setShowExampleTab] = useState(true);
  const active = useMemo(() => translationKeys.filter((item) => item.locale === locale), [locale]);
  const missingCount = active.filter((item) => item.status === "missing").length;
  const reviewCount = active.filter((item) => item.status === "review").length;
  const decision = missingCount > 0 && releaseBlocking
    ? `Block release for ${locale} until critical keys are translated.`
    : reviewCount > 0
      ? `Locale ${locale} can ship only behind review banner and staged rollout.`
      : `Locale ${locale} is approved for runtime publish.`;
  const exampleTabWarning = showExampleTab && missingCount > 0 ? "Hide the example tab until missing CTA keys are resolved." : "Example tab can follow the locale release policy.";

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-indigo-300">Frontend i18n/l10n</p>
        <h1 className="mt-2 text-3xl font-semibold">Translation management console</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Track key review state, namespace ownership, release blocking, and example-tab readiness by locale.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={locale} onChange={(event) => setLocale(event.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              <option value="en">en</option>
              <option value="fr">fr</option>
              <option value="ar">ar</option>
            </select>
            <label className="flex items-center gap-3"><input type="checkbox" checked={releaseBlocking} onChange={(event) => setReleaseBlocking(event.target.checked)} /> Critical missing keys block release</label>
            <label className="flex items-center gap-3"><input type="checkbox" checked={showExampleTab} onChange={(event) => setShowExampleTab(event.target.checked)} /> Surface example tab for this locale</label>
            <div className="space-y-3">
              {active.map((item) => (
                <div key={`${item.locale}-${item.key}`} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="font-medium text-slate-100">{item.key}</div>
                  <div className="mt-1 text-xs text-slate-400">Status: {item.status} · Owner: {item.owner}</div>
                </div>
              ))}
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Release decision</div>
              <p className="mt-2">{decision}</p>
              <p className="mt-2">{exampleTabWarning}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Policies</div>
              <ul className="mt-2 space-y-2">{translationPolicies.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
