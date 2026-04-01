"use client";

import { useEffect, useState } from "react";

type SearchResult = { id: string; title: string; score: number; explanation: string; matchedFields: string[]; analyzer: "standard" | "synonym" };
type SearchState = { query: string; analyzer: "standard" | "synonym"; tookMs: number; totalHits: number; queryHistory: string[]; warnings: string[]; results: SearchResult[]; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<SearchState | null>(null);
  const [query, setQuery] = useState("distributed systems");
  const [analyzer, setAnalyzer] = useState<"standard" | "synonym">("standard");

  async function refresh() {
    const response = await fetch("/api/search/state");
    const data = (await response.json()) as SearchState;
    setState(data);
    setQuery(data.query);
    setAnalyzer(data.analyzer);
  }

  async function runQuery(nextQuery = query) {
    const response = await fetch("/api/search/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: nextQuery, analyzer })
    });
    setState((await response.json()) as SearchState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Elasticsearch Search Workbench</h1>
      <p className="mt-2 text-slate-300">Submit a query, inspect ranked hits, and review lightweight scoring explanations from the simulated index.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="block text-sm font-semibold text-slate-100">Query</label>
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
          <label className="mt-4 block text-sm font-semibold text-slate-100">Analyzer</label>
          <select value={analyzer} onChange={(event) => setAnalyzer(event.target.value as "standard" | "synonym")} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
            <option value="standard">Standard analyzer</option>
            <option value="synonym">Synonym-aware analyzer</option>
          </select>
          <button onClick={runQuery} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Run search</button>
          <div className="mt-5 text-sm text-slate-300">
            <div>Took: <span className="font-semibold text-slate-100">{state?.tookMs} ms</span></div>
            <div className="mt-2">Total hits: <span className="font-semibold text-slate-100">{state?.totalHits}</span></div>
          </div>
          <div className="mt-5">
            <div className="text-sm font-semibold text-slate-100">Recent queries</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {state?.queryHistory.map((item) => (
                <li key={item} className="rounded border border-slate-800 px-3 py-2">
                  <button onClick={() => { setQuery(item); void runQuery(item); }} className="w-full text-left">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          {state?.warnings.length ? (
            <div className="mb-4 rounded border border-amber-700/40 bg-amber-500/10 px-3 py-3 text-amber-200">
              {state.warnings.join(" ")}
            </div>
          ) : null}
          <ul className="space-y-3">
            {state?.results.map((result) => (
              <li key={result.id} className="rounded-lg border border-slate-800 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="font-semibold text-slate-100">{result.title}</div>
                  <div className="font-mono text-xs text-slate-400">score {result.score}</div>
                </div>
                <div className="mt-2 text-slate-400">{result.explanation}</div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {result.matchedFields.map((field) => (
                    <span key={field} className="rounded-full border border-slate-700 px-2 py-1">{field}</span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
