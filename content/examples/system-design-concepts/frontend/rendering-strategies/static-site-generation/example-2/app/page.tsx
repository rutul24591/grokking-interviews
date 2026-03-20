"use client";

import { useMemo, useState } from "react";
import { search } from "@/lib/search";

export default function Page() {
  const [q, setQ] = useState("");
  const results = useMemo(() => (q.trim() ? search(q) : []), [q]);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">SSG Search</h1>
        <p className="mt-1 text-sm text-slate-300">
          Search runs entirely in the browser against a build-time index.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-300">
            Query
          </label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try: ssg, build, pipelines..."
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-indigo-400"
          />

          <div className="mt-4 text-xs text-slate-500">
            Results: {results.length}
          </div>

          <ul className="mt-3 space-y-3">
            {results.map((r) => (
              <li key={r.slug} className="rounded-xl border border-slate-800 bg-slate-950/30 p-3">
                <div className="text-sm font-semibold text-slate-100">{r.title}</div>
                <div className="mt-1 text-sm text-slate-300">{r.excerpt}</div>
              </li>
            ))}
            {!results.length && q.trim() ? (
              <li className="text-sm text-slate-400">No matches.</li>
            ) : null}
          </ul>
        </div>
      </div>
    </main>
  );
}

