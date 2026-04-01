"use client";
import { useEffect, useMemo, useState } from "react";

type LayoutMode = "top-3" | "top-5";
type Region = "homepage" | "explore";
type TrendingCard = { id: string; title: string; rank: number; reason: string; badge: string; confidence: number; duplicateGroup: string | null };
type TrendingSectionState = { layoutMode: LayoutMode; region: Region; showReasons: boolean; cards: TrendingCard[]; visibleIds: string[]; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<TrendingSectionState | null>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("top-3");
  const [region, setRegion] = useState<Region>("homepage");
  const [showReasons, setShowReasons] = useState(true);
  async function refresh() {
    const response = await fetch('/api/section/state');
    const data = (await response.json()) as TrendingSectionState;
    setState(data);
    setLayoutMode(data.layoutMode);
    setRegion(data.region);
    setShowReasons(data.showReasons);
  }
  async function applyLayout() {
    const response = await fetch('/api/section/layout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ layoutMode, region, showReasons }) });
    setState((await response.json()) as TrendingSectionState);
  }
  useEffect(() => { void refresh(); }, []);
  const visibleCards = useMemo(() => state?.visibleIds.map((id) => state.cards.find((card) => card.id === id)).filter(Boolean) as TrendingCard[] ?? [], [state]);
  return <main className="mx-auto max-w-6xl px-6 py-10"><h1 className="text-3xl font-bold">Trending Section</h1><p className="mt-2 text-slate-300">Tune card count, region-specific duplication policy, and explanatory metadata for a trending module.</p><section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]"><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300"><label className="block font-semibold text-slate-100">Visible card count</label><select value={layoutMode} onChange={(event) => setLayoutMode(event.target.value as LayoutMode)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"><option value="top-3">Top 3</option><option value="top-5">Top 5</option></select><label className="mt-4 block font-semibold text-slate-100">Region</label><select value={region} onChange={(event) => setRegion(event.target.value as Region)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"><option value="homepage">Homepage</option><option value="explore">Explore</option></select><label className="mt-4 flex items-center gap-2"><input type="checkbox" checked={showReasons} onChange={(event) => setShowReasons(event.target.checked)} />Show explanation copy</label><button onClick={applyLayout} className="mt-4 rounded bg-sky-600 px-4 py-2 font-semibold hover:bg-sky-500">Apply layout</button><p className="mt-4 text-slate-400">{state?.lastMessage}</p></article><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><ul className="space-y-3 text-sm text-slate-300">{visibleCards.map((card) => <li key={card.id} className="rounded border border-slate-800 px-3 py-3"><div className="flex items-center justify-between"><div className="font-semibold text-slate-100">#{card.rank} {card.title}</div><span className="rounded-full border border-slate-700 px-2 py-1 text-xs">{card.badge}</span></div>{showReasons ? <p className="mt-2 text-slate-400">{card.reason}</p> : null}<div className="mt-2 flex items-center justify-between text-xs text-slate-500"><span>confidence {card.confidence}</span><span>{card.duplicateGroup ? `group ${card.duplicateGroup}` : "unique"}</span></div></li>)}</ul></article></section></main>;
}
