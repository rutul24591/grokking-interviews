"use client";
import { useEffect, useMemo, useState } from "react";

type TrendingWindow = "1h" | "6h" | "24h";
type TrendingItem = { id: string; title: string; views: number; saves: number; acceleration: number };
type TrendingState = { window: TrendingWindow; items: TrendingItem[]; rankedIds: string[]; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<TrendingState | null>(null);
  const [windowKey, setWindowKey] = useState<TrendingWindow>("6h");
  async function refresh() {
    const response = await fetch('/api/trending/state');
    const data = (await response.json()) as TrendingState;
    setState(data);
    setWindowKey(data.window);
  }
  async function recompute() {
    const response = await fetch('/api/trending/window', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ window: windowKey }) });
    setState((await response.json()) as TrendingState);
  }
  useEffect(() => { void refresh(); }, []);
  const rankedItems = useMemo(() => state?.rankedIds.map((id) => state.items.find((item) => item.id === id)).filter(Boolean) as TrendingItem[] ?? [], [state]);
  return <main className="mx-auto max-w-6xl px-6 py-10"><h1 className="text-3xl font-bold">Trending Computation</h1><p className="mt-2 text-slate-300">Recompute trending content using different time windows and acceleration-sensitive scoring.</p><section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]"><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300"><label className="block font-semibold text-slate-100">Scoring window</label><select value={windowKey} onChange={(event) => setWindowKey(event.target.value as TrendingWindow)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"><option value="1h">1 hour</option><option value="6h">6 hours</option><option value="24h">24 hours</option></select><button onClick={recompute} className="mt-4 rounded bg-sky-600 px-4 py-2 font-semibold hover:bg-sky-500">Recompute trending</button><p className="mt-4 text-slate-400">{state?.lastMessage}</p></article><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><ul className="space-y-3 text-sm text-slate-300">{rankedItems.map((item, index) => <li key={item.id} className="rounded border border-slate-800 px-3 py-3"><div className="font-semibold text-slate-100">#{index + 1} {item.title}</div><div className="mt-2 text-xs">views {item.views} · saves {item.saves} · acceleration {item.acceleration}</div></li>)}</ul></article></section></main>;
}
