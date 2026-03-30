"use client";

import { useMemo, useState } from "react";

type Entry = { key: string; source: string; ageSeconds: number; tag: string };
const initial: Entry[] = [
  { key: 'catalog', source: 'ttl', ageSeconds: 12, tag: 'catalog' },
  { key: 'homepage', source: 'manual', ageSeconds: 4, tag: 'home' },
  { key: 'inventory', source: 'event', ageSeconds: 1, tag: 'inventory' }
];

export function InvalidationLab() {
  const [entries, setEntries] = useState(initial);
  const [mutationSource, setMutationSource] = useState<"catalog-change" | "manual-purge" | "inventory-event">("inventory-event");
  const expired = useMemo(() => entries.filter((entry) => entry.source === 'ttl' && entry.ageSeconds > 10).map((entry) => entry.key), [entries]);
  return (
    <main className="mx-auto min-h-screen max-w-5xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Cache invalidation</p>
        <h1 className="mt-2 text-3xl font-semibold">Freshness control panel</h1>
        <div className="mt-6 flex flex-wrap gap-3">
          <select className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" value={mutationSource} onChange={(event) => setMutationSource(event.target.value as "catalog-change" | "manual-purge" | "inventory-event")}>
            <option value="catalog-change">Catalog change</option>
            <option value="manual-purge">Manual purge</option>
            <option value="inventory-event">Inventory event</option>
          </select>
        </div>
        <div className="mt-6 grid gap-3">
          {entries.map((entry) => (
            <article key={entry.key} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium">{entry.key}</h2>
                  <p className="mt-1 text-sm text-slate-400">policy={entry.source} · age={entry.ageSeconds}s · tag={entry.tag}</p>
                </div>
                <button className="rounded-xl border border-slate-700 px-3 py-2" onClick={() => setEntries((current) => current.filter((candidate) => candidate.key !== entry.key))}>Bust</button>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <button className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950" onClick={() => setEntries(initial)}>Reset</button>
          <button className="rounded-2xl border border-slate-700 px-4 py-3" onClick={() => setEntries((current) => current.map((entry) => entry.tag === 'inventory' ? { ...entry, ageSeconds: 0 } : entry))}>Event refresh inventory</button>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">TTL-expired keys: {expired.join(', ') || 'none'}</div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">Selected mutation source: {mutationSource}</div>
        </div>
      </section>
    </main>
  );
}
