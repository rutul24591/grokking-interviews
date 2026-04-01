"use client";
import { useEffect, useMemo, useState } from "react";

type Strategy = "tag-overlap" | "same-series" | "hybrid";
type ContentItem = { id: string; title: string; series: string; sharedTags: number; recency: number };
type RelatedState = {
  strategy: Strategy;
  current: { id: string; title: string; series: string };
  candidates: ContentItem[];
  relatedIds: string[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<RelatedState | null>(null);
  const [strategy, setStrategy] = useState<Strategy>("hybrid");
  async function refresh() {
    const response = await fetch('/api/related/state');
    const data = (await response.json()) as RelatedState;
    setState(data);
    setStrategy(data.strategy);
  }
  async function recompute() {
    const response = await fetch('/api/related/strategy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ strategy }) });
    setState((await response.json()) as RelatedState);
  }
  useEffect(() => { void refresh(); }, []);
  const relatedItems = useMemo(() => state?.relatedIds.map((id) => state.candidates.find((item) => item.id === id)).filter(Boolean) as ContentItem[] ?? [], [state]);
  return <main className="mx-auto max-w-6xl px-6 py-10"><h1 className="text-3xl font-bold">Related Content</h1><p className="mt-2 text-slate-300">Build a related-content module using tag overlap, series continuity, or a hybrid strategy.</p><section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]"><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300"><div className="text-xs uppercase tracking-[0.3em] text-slate-500">Current article</div><div className="mt-2 rounded-lg border border-slate-800 px-3 py-2">{state?.current.title}</div><label className="mt-5 block font-semibold text-slate-100">Strategy</label><select value={strategy} onChange={(event) => setStrategy(event.target.value as Strategy)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"><option value="tag-overlap">Tag overlap</option><option value="same-series">Same series</option><option value="hybrid">Hybrid</option></select><button onClick={recompute} className="mt-4 rounded bg-sky-600 px-4 py-2 font-semibold hover:bg-sky-500">Refresh related items</button><p className="mt-4 text-slate-400">{state?.lastMessage}</p></article><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><ul className="space-y-3 text-sm text-slate-300">{relatedItems.map((item) => <li key={item.id} className="rounded border border-slate-800 px-3 py-3"><div className="font-semibold text-slate-100">{item.title}</div><div className="mt-1 text-slate-400">series {item.series}</div><div className="mt-2 text-xs">shared tags {item.sharedTags} · recency {item.recency}</div></li>)}</ul></article></section></main>;
}
