"use client";
import { useState } from "react";
export function OptimisticUiClient() {
  const [liked, setLiked] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [pendingWrites, setPendingWrites] = useState(0);
  async function toggleLike() {
    const previous = liked;
    setPendingWrites((count) => count + 1);
    setLiked(!liked);
    setStatus('Optimistically updated UI');
    const ok = !previous;
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (!ok) {
      setLiked(previous);
      setStatus('Rolled back after simulated failure');
      setPendingWrites((count) => Math.max(0, count - 1));
      return;
    }
    setStatus('Server confirmed write');
    setPendingWrites((count) => Math.max(0, count - 1));
  }
  return <main className="mx-auto min-h-screen max-w-5xl p-8"><section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6"><p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Optimistic UI updates</p><h1 className="mt-2 text-3xl font-semibold">Feed action panel</h1><div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]"><div><button className="rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950" onClick={()=>void toggleLike()}>{liked?'Unlike':'Like'}</button><div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">{status}</div></div><aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"><h2 className="text-lg font-medium">Write queue</h2><p className="mt-3 text-sm text-slate-300">Pending writes: {pendingWrites}</p><p className="mt-2 text-sm text-slate-400">Rollback metadata matters when the server rejects the optimistic mutation.</p></aside></div></section></main>;
}
