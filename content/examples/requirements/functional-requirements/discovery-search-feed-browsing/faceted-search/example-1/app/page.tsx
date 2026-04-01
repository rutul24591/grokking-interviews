"use client";

import { useEffect, useState } from "react";

type Result = { id: string; title: string; level: string; category: string };
type FacetState = { applied: { level: string; category: string }; available: { level: string[]; category: string[] }; results: Result[]; counts: { level: Record<string, number>; category: Record<string, number> }; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<FacetState | null>(null);
  const [level, setLevel] = useState("all");
  const [category, setCategory] = useState("all");

  async function refresh() {
    const response = await fetch("/api/facets/state");
    const data = (await response.json()) as FacetState;
    setState(data);
    setLevel(data.applied.level);
    setCategory(data.applied.category);
  }

  async function apply() {
    const response = await fetch("/api/facets/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, category })
    });
    setState((await response.json()) as FacetState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Faceted Search</h1>
      <p className="mt-2 text-slate-300">Narrow the result set with multiple facets, show active filter state, and preserve per-facet result counts.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <label className="block">Level</label>
          <select value={level} onChange={(event) => setLevel(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            {state?.available.level.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <label className="mt-4 block">Category</label>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            {state?.available.category.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <button onClick={apply} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Apply facets</button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="mb-4">Active filters: <span className="font-semibold text-slate-100">{state?.applied.level} / {state?.applied.category}</span></div>
          <ul className="space-y-3">
            {state?.results.map((result) => (
              <li key={result.id} className="rounded-lg border border-slate-800 p-4">
                <div className="font-semibold text-slate-100">{result.title}</div>
                <div className="mt-1 text-slate-400">{result.level} · {result.category}</div>
              </li>
            ))}
          </ul>
          <p className="mt-5">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
