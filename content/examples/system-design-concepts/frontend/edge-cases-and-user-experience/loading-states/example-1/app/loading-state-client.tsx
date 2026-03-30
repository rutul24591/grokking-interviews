"use client";
import { useEffect, useState } from "react";
export function LoadingStateClient() {
  const [phase, setPhase] = useState<'loading'|'partial'|'ready'>('loading');
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    const a = setTimeout(() => setPhase('partial'), 700);
    const b = setTimeout(() => setPhase('ready'), 1400);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  return <main className="mx-auto min-h-screen max-w-5xl p-8"><section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.25em] text-violet-300">Loading states</p><h1 className="mt-2 text-3xl font-semibold">Progressive dashboard load</h1></div><button className="rounded-2xl border border-slate-700 px-4 py-3" onClick={() => setRefreshing((value) => !value)}>{refreshing ? "Background refresh active" : "Simulate refresh"}</button></div>{phase==='loading'?<div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">Loading summary cards…</div>:null}{phase!=='loading'?<div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">Summary cards loaded.</div>:null}{phase==='ready'?<div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">Charts and drill-downs loaded.</div>:<div className="mt-4 text-sm text-slate-400">Heavy content is still loading in the background.</div>}<div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">{refreshing ? "Refresh keeps current data visible while background work runs." : "Initial load uses stronger placeholders than background refresh."}</div></section></main>;
}
