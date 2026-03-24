"use client";

import { useMemo, useRef, useState } from "react";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function searchAll(q: string) {
  const corpus = [
    "Accessibility audit checklist",
    "Keyboard navigation patterns",
    "Focus management for SPAs",
    "ARIA attribute do's and don'ts",
    "Semantic HTML foundations"
  ];
  const query = q.trim().toLowerCase();
  return corpus.filter((c) => c.toLowerCase().includes(query));
}

export default function Page() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const resultsHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const canSearch = useMemo(() => q.trim().length >= 2, [q]);

  async function runSearch({ focusResults }: { focusResults: boolean }) {
    if (!canSearch) return;
    setLoading(true);
    setAnnouncement("Searching…");
    await sleep(250);
    const out = searchAll(q);
    setResults(out);
    setLoading(false);
    setAnnouncement(`${out.length} results updated.`);
    if (focusResults) resultsHeadingRef.current?.focus();
  }

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Async updates without focus stealing</h1>
        <p className="mt-2 text-slate-300">
          Results update without moving focus away from the input. Focus shifts to results only when the user asks.
        </p>
      </header>

      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <label className="text-sm font-semibold text-slate-100" htmlFor="q">
          Search
        </label>
        <input
          id="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
          placeholder="Type at least 2 characters…"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!canSearch || loading}
            onClick={() => void runSearch({ focusResults: false })}
            className="rounded-md bg-indigo-500/20 px-4 py-2 text-sm font-semibold hover:bg-indigo-500/30 disabled:opacity-40"
          >
            Update results (keep focus)
          </button>
          <button
            type="button"
            disabled={!canSearch || loading}
            onClick={() => void runSearch({ focusResults: true })}
            className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15 disabled:opacity-40"
          >
            Update + focus results
          </button>
          <span className="self-center text-sm text-slate-300">{loading ? "Loading…" : ""}</span>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 ref={resultsHeadingRef} tabIndex={-1} className="text-xl font-semibold outline-none">
          Results
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          {results.length === 0 ? <li className="text-slate-400">No results yet.</li> : null}
          {results.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

