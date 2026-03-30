"use client";

import { useState } from "react";

const rows = [
  { topic: "Update granularity", appCache: "Manifest change invalidates the whole cache set", sw: "Versioned caches and route-level strategies" },
  { topic: "Offline fallback", appCache: "Single fallback map with limited control", sw: "Per-request navigation and asset fallbacks" },
  { topic: "Rollout safety", appCache: "Hard to stage safely", sw: "Controlled activation and skip-waiting flows" },
];

export function CacheMigrationConsole() {
  const [phase, setPhase] = useState<"audit" | "migrate" | "retire">("migrate");

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-rose-300">Application Cache</p>
            <h1 className="mt-2 text-3xl font-semibold">Legacy offline migration guide</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">Treat AppCache as migration territory. This console frames the decision and the replacement plan rather than pretending AppCache is still a viable design choice.</p>
          </div>
          <select className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" value={phase} onChange={(event) => setPhase(event.target.value as "audit" | "migrate" | "retire")}>
            <option value="audit">Audit legacy pages</option>
            <option value="migrate">Migrate to Service Worker</option>
            <option value="retire">Retire AppCache paths</option>
          </select>
        </div>
        <div className="mt-6 grid gap-4">
          {rows.map((row) => (
            <article key={row.topic} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <h2 className="text-lg font-medium">{row.topic}</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-100">AppCache: {row.appCache}</div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">Service Worker: {row.sw}</div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
          Current phase: {phase}. Outcome should be explicit replacement planning, not continued AppCache investment.
        </div>
      </section>
    </main>
  );
}
