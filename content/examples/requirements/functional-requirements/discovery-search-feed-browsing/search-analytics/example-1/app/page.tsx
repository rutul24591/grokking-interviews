"use client";
import { useEffect, useMemo, useState } from "react";

type WindowKey = "24h" | "7d" | "30d";
type SearchQuery = { id: string; term: string; searches: number; ctr: number; zeroResultRate: number };
type AnalyticsState = { window: WindowKey; queries: SearchQuery[]; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<AnalyticsState | null>(null);
  const [windowKey, setWindowKey] = useState<WindowKey>("7d");
  async function refresh() {
    const response = await fetch('/api/analytics/state');
    const data = (await response.json()) as AnalyticsState;
    setState(data);
    setWindowKey(data.window);
  }
  async function applyWindow() {
    const response = await fetch('/api/analytics/window', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ window: windowKey }) });
    setState((await response.json()) as AnalyticsState);
  }
  useEffect(() => { void refresh(); }, []);
  const summary = useMemo(() => {
    const queries = state?.queries ?? [];
    const totalSearches = queries.reduce((sum, query) => sum + query.searches, 0);
    const avgCtr = queries.length ? queries.reduce((sum, query) => sum + query.ctr, 0) / queries.length : 0;
    return { totalSearches, avgCtr: avgCtr.toFixed(2) };
  }, [state]);
  return <main className="mx-auto max-w-6xl px-6 py-10"><h1 className="text-3xl font-bold">Search Analytics</h1><p className="mt-2 text-slate-300">Inspect search query health, zero-result rate, and CTR to decide what to improve next.</p><section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]"><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300"><label className="block font-semibold text-slate-100">Analytics window</label><select value={windowKey} onChange={(event) => setWindowKey(event.target.value as WindowKey)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"><option value="24h">24 hours</option><option value="7d">7 days</option><option value="30d">30 days</option></select><button onClick={applyWindow} className="mt-4 rounded bg-sky-600 px-4 py-2 font-semibold hover:bg-sky-500">Apply window</button><div className="mt-5 rounded-lg border border-slate-800 px-3 py-3"><div>Total searches {summary.totalSearches}</div><div className="mt-1">Average CTR {summary.avgCtr}</div></div><p className="mt-4 text-slate-400">{state?.lastMessage}</p></article><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><ul className="space-y-3 text-sm text-slate-300">{state?.queries.map((query) => <li key={query.id} className="rounded border border-slate-800 px-3 py-3"><div className="font-semibold text-slate-100">{query.term}</div><div className="mt-2 grid gap-1 text-xs text-slate-400"><span>searches {query.searches}</span><span>ctr {query.ctr}</span><span>zero-result rate {query.zeroResultRate}</span></div></li>)}</ul></article></section></main>;
}
