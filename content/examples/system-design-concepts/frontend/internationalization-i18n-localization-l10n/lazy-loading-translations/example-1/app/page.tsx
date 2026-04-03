"use client";

import { useMemo, useState } from "react";
import { bundlePolicies, translationBundles } from "@/lib/store";

export default function Page() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [preloadNext, setPreloadNext] = useState(true);
  const [missingBundle, setMissingBundle] = useState(false);
  const bundle = translationBundles[activeIndex];

  const decision = useMemo(() => {
    if (missingBundle) return `Fallback to base locale strings for ${bundle.locale}/${bundle.section} and log a missing bundle event.`;
    if (bundle.status === "loading") return `Render namespace skeletons while ${bundle.locale}/${bundle.section} is still loading.`;
    return preloadNext ? "Preload the next critical locale bundle in the background." : "Load on demand and accept the first-view latency.";
  }, [bundle, missingBundle, preloadNext]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-fuchsia-300">Frontend i18n/l10n</p>
        <h1 className="mt-2 text-3xl font-semibold">Lazy translation loading console</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={activeIndex} onChange={(event) => setActiveIndex(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {translationBundles.map((item, index) => <option key={`${item.locale}-${item.section}`} value={index}>{item.locale} · {item.section}</option>)}
            </select>
            <label className="flex items-center gap-3"><input type="checkbox" checked={preloadNext} onChange={(event) => setPreloadNext(event.target.checked)} /> Preload next critical route bundle</label>
            <label className="flex items-center gap-3"><input type="checkbox" checked={missingBundle} onChange={(event) => setMissingBundle(event.target.checked)} /> Simulate missing bundle</label>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Bundle state</div>
              <p className="mt-2 text-slate-100">{bundle.locale}/{bundle.section} · {bundle.status}</p>
              <p className="mt-2 text-slate-400">Translation keys: {bundle.keys}</p>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Loading decision</div>
              <p className="mt-2">{decision}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Policies</div>
              <ul className="mt-2 space-y-2">{bundlePolicies.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
