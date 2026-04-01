"use client";
import { useEffect, useState } from "react";

type ViewMode = "compact" | "detailed";
type SearchResultCard = { id: string; title: string; excerpt: string; badges: string[]; matchedTerms: number };
type SearchResultsUiState = { viewMode: ViewMode; query: string; totalResults: number; results: SearchResultCard[]; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<SearchResultsUiState | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("detailed");
  async function refresh() {
    const response = await fetch('/api/results/state');
    const data = (await response.json()) as SearchResultsUiState;
    setState(data);
    setViewMode(data.viewMode);
  }
  async function applyView() {
    const response = await fetch('/api/results/layout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ viewMode }) });
    setState((await response.json()) as SearchResultsUiState);
  }
  useEffect(() => { void refresh(); }, []);
  return <main className="mx-auto max-w-6xl px-6 py-10"><h1 className="text-3xl font-bold">Search Results UI</h1><p className="mt-2 text-slate-300">Tune result density and information richness for a search results page.</p><section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]"><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300"><div className="text-xs uppercase tracking-[0.3em] text-slate-500">Query</div><div className="mt-2 rounded-lg border border-slate-800 px-3 py-2">{state?.query} · {state?.totalResults} results</div><label className="mt-5 block font-semibold text-slate-100">Result layout</label><select value={viewMode} onChange={(event) => setViewMode(event.target.value as ViewMode)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"><option value="detailed">Detailed</option><option value="compact">Compact</option></select><button onClick={applyView} className="mt-4 rounded bg-sky-600 px-4 py-2 font-semibold hover:bg-sky-500">Apply layout</button><p className="mt-4 text-slate-400">{state?.lastMessage}</p></article><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><ul className="space-y-3 text-sm text-slate-300">{state?.results.map((result) => <li key={result.id} className="rounded border border-slate-800 px-3 py-3"><div className="font-semibold text-slate-100">{result.title}</div><div className="mt-2 flex flex-wrap gap-2 text-xs">{result.badges.map((badge) => <span key={badge} className="rounded-full border border-slate-700 px-2 py-1">{badge}</span>)}</div>{viewMode === 'detailed' ? <p className="mt-2 text-slate-400">{result.excerpt}</p> : null}<div className="mt-2 text-xs">matched terms {result.matchedTerms}</div></li>)}</ul></article></section></main>;
}
