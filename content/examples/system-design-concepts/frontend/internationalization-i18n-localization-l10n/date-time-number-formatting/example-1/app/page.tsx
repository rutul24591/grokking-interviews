"use client";

import { useMemo, useState } from "react";
import { formattingNotes, formattingPanels, formattingSamples } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [compact, setCompact] = useState(false);
  const [browserTimezone, setBrowserTimezone] = useState("America/New_York");
  const sample = formattingSamples[selected];

  const dateLabel = useMemo(() => new Intl.DateTimeFormat(sample.locale, { dateStyle: "full", timeStyle: "short", timeZone: sample.timezone }).format(new Date(sample.date)), [sample]);
  const browserDateLabel = useMemo(() => new Intl.DateTimeFormat(sample.locale, { dateStyle: "full", timeStyle: "short", timeZone: browserTimezone }).format(new Date(sample.date)), [sample, browserTimezone]);
  const numberLabel = useMemo(() => new Intl.NumberFormat(sample.locale, { notation: compact ? "compact" : "standard", maximumFractionDigits: compact ? 1 : 2 }).format(sample.metric), [compact, sample]);
  const warnings = useMemo(() => {
    const out = [];
    if (compact && sample.surface === "audit") out.push("Compact numbers hide precision on audit surfaces.");
    if (browserTimezone !== sample.timezone) out.push(`Browser timezone ${browserTimezone} differs from the source timezone ${sample.timezone}.`);
    if (sample.surface === "incident") out.push("Incident timelines should show both localized time and raw UTC.");
    return out;
  }, [browserTimezone, compact, sample]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Frontend i18n/l10n</p>
        <h1 className="mt-2 text-3xl font-semibold">Date, time, and number formatting console</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Compare source and browser timezones, compact number policy, and audit-safe display patterns.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {formattingSamples.map((item, index) => <option key={item.locale + item.timezone} value={index}>{item.locale} · {item.timezone} · {item.surface}</option>)}
            </select>
            <div className="grid gap-4 md:grid-cols-2">
              <select value={browserTimezone} onChange={(event) => setBrowserTimezone(event.target.value)} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                <option value="America/New_York">America/New_York</option>
                <option value="UTC">UTC</option>
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="Africa/Cairo">Africa/Cairo</option>
              </select>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"><input type="checkbox" checked={compact} onChange={(event) => setCompact(event.target.checked)} /> Use compact number notation</label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Source timezone</div>
                <p className="mt-2 text-slate-100">{dateLabel}</p>
                <p className="mt-2 text-xs text-slate-400">UTC raw: {sample.date}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Browser preview</div>
                <p className="mt-2 text-slate-100">{browserDateLabel}</p>
                <p className="mt-2 text-xs text-slate-400">Metric: {numberLabel}</p>
              </div>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Warnings</div>
              {warnings.length === 0 ? <p className="mt-2 text-emerald-200">No formatting risk detected.</p> : <ul className="mt-2 space-y-2 text-amber-200">{warnings.map((item) => <li key={item}>{item}</li>)}</ul>}
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Panels and notes</div>
              <ul className="mt-2 space-y-2">{formattingPanels.concat(formattingNotes).map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
