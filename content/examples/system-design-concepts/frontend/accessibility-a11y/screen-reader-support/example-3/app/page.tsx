"use client";

import { useMemo, useState } from "react";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function queryAll(q: string) {
  const corpus = ["A11y checklist", "ARIA patterns", "Keyboard navigation", "Focus management", "Semantic HTML"];
  const s = q.trim().toLowerCase();
  return corpus.filter((c) => c.toLowerCase().includes(s));
}

export default function Page() {
  const [q, setQ] = useState("a");
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<string[]>(queryAll("a"));
  const [announcement, setAnnouncement] = useState("");

  const canSearch = useMemo(() => q.trim().length >= 1, [q]);

  async function run() {
    if (!canSearch) return;
    setBusy(true);
    setAnnouncement("Searching…");
    await sleep(300);
    const out = queryAll(q);
    setResults(out);
    setBusy(false);
    setAnnouncement(`${out.length} results updated.`);
  }

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Loading states for screen readers</h1>
        <p className="mt-2 text-slate-300">
          Mark regions as busy during updates and announce summaries (don’t re-announce entire lists).
        </p>
      </header>

      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <label className="text-sm font-semibold text-slate-100" htmlFor="q">
          Query
        </label>
        <input
          id="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
        />
        <button
          type="button"
          onClick={() => void run()}
          className="mt-4 rounded-md bg-indigo-500/20 px-4 py-2 text-sm font-semibold hover:bg-indigo-500/30"
        >
          Search
        </button>
      </section>

      <section
        className="rounded-xl border border-white/10 bg-white/5 p-6"
        aria-label="Results"
        aria-busy={busy || undefined}
      >
        <h2 className="text-xl font-semibold">Results</h2>
        <p className="mt-2 text-sm text-slate-300">{busy ? "Loading…" : "Ready"}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          {results.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

