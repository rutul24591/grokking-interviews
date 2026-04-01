"use client";
import { useEffect, useMemo, useState } from "react";

type RankingMode = "relevance" | "freshness" | "balanced";
type RankedResult = { id: string; title: string; bm25: number; freshness: number; quality: number; pinned: boolean; editorialScore: number };
type SearchRankingState = { mode: RankingMode; pinnedOn: boolean; results: RankedResult[]; rankedIds: string[]; metrics: { mrr: number; ndcg: number }; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<SearchRankingState | null>(null);
  const [mode, setMode] = useState<RankingMode>("balanced");
  const [pinnedOn, setPinnedOn] = useState(true);
  async function refresh() {
    const response = await fetch('/api/ranking/state');
    const data = (await response.json()) as SearchRankingState;
    setState(data);
    setMode(data.mode);
    setPinnedOn(data.pinnedOn);
  }
  async function updateMode() {
    const response = await fetch('/api/ranking/mode', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode, pinnedOn }) });
    setState((await response.json()) as SearchRankingState);
  }
  useEffect(() => { void refresh(); }, []);
  const rankedItems = useMemo(() => state?.rankedIds.map((id) => state.results.find((item) => item.id === id)).filter(Boolean) as RankedResult[] ?? [], [state]);
  return <main className="mx-auto max-w-6xl px-6 py-10"><h1 className="text-3xl font-bold">Search Ranking</h1><p className="mt-2 text-slate-300">Compare ranking strategies, pinning policy, and relevance metrics for the same result set.</p><section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]"><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300"><label className="block font-semibold text-slate-100">Ranking mode</label><select value={mode} onChange={(event) => setMode(event.target.value as RankingMode)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"><option value="relevance">Relevance-first</option><option value="freshness">Freshness-first</option><option value="balanced">Balanced</option></select><label className="mt-4 flex items-center gap-2"><input type="checkbox" checked={pinnedOn} onChange={(event) => setPinnedOn(event.target.checked)} />Keep pinned result at the top</label><button onClick={updateMode} className="mt-4 rounded bg-sky-600 px-4 py-2 font-semibold hover:bg-sky-500">Re-rank results</button><div className="mt-5 grid gap-3 rounded-lg border border-slate-800 p-4"><div className="flex items-center justify-between"><span>MRR</span><span className="font-semibold text-slate-100">{state?.metrics.mrr ?? 0}</span></div><div className="flex items-center justify-between"><span>NDCG</span><span className="font-semibold text-slate-100">{state?.metrics.ndcg ?? 0}</span></div></div><p className="mt-4 text-slate-400">{state?.lastMessage}</p></article><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><ul className="space-y-3 text-sm text-slate-300">{rankedItems.map((item, index) => <li key={item.id} className="rounded border border-slate-800 px-3 py-3"><div className="flex items-center justify-between gap-3"><div className="font-semibold text-slate-100">#{index + 1} {item.title}</div>{item.pinned ? <span className="rounded-full border border-slate-700 px-2 py-1 text-xs">pinned</span> : null}</div><div className="mt-2 grid gap-1 text-xs text-slate-400"><span>bm25 {item.bm25}</span><span>freshness {item.freshness}</span><span>quality {item.quality}</span><span>editorial {item.editorialScore}</span></div></li>)}</ul></article></section></main>;
}
