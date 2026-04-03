"use client";

import { useState } from "react";

import { ReviewNote } from "../components/ReviewNote";

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { ...init, headers: { 'content-type': 'application/json', ...(init?.headers || {}) } });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `${res.status}`);
  return (text ? JSON.parse(text) : null) as T;
}

export default function Page() {
  const [streamId, setStreamId] = useState('orders');
  const [seq, setSeq] = useState(1);
  const [state, setState] = useState<any>(null);
  const [error, setError] = useState('');

  async function refresh() { setState(await json(`/api/stream/state?streamId=${encodeURIComponent(streamId)}`)); }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      <header className="space-y-2"><h1 className="text-3xl font-bold">Ordered Stream Lab</h1><p className="text-sm text-slate-300">Publish events out of order, inspect buffering, and verify that duplicates are ignored.</p></header>
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 space-y-3">
          <label className="space-y-1 text-sm"><div className="text-slate-300">Stream id</div><input className="w-full rounded border border-slate-700 bg-slate-950/40 px-3 py-2" value={streamId} onChange={(e) => setStreamId(e.target.value)} /></label>
          <label className="space-y-1 text-sm"><div className="text-slate-300">Sequence</div><input className="w-full rounded border border-slate-700 bg-slate-950/40 px-3 py-2" type="number" value={seq} onChange={(e) => setSeq(Number(e.target.value))} /></label>
          <div className="flex flex-wrap gap-2">
            <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={async () => { setError(''); try { await json('/api/stream/publish', { method: 'POST', body: JSON.stringify({ streamId, seq, payload: { state: `event-${seq}` } }) }); await refresh(); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } }}>Publish</button>
            <button className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700" onClick={() => setSeq((prev) => prev + 1)}>Next seq</button>
            <button className="rounded bg-amber-600 px-4 py-2 text-sm font-semibold hover:bg-amber-500" onClick={async () => { await json('/api/stream/reset', { method: 'POST', body: '{}' }); await refresh(); }}>Reset stream</button>
          </div>
          <button className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500" onClick={() => refresh().catch(() => {})}>Refresh state</button>
          {error ? <div className="rounded border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}
        </div>
        <pre className="overflow-auto rounded-xl border border-slate-700 bg-black/40 p-4 text-xs text-slate-100">{JSON.stringify(state, null, 2)}</pre>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether message ordering guarantees is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For message ordering guarantees, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For message ordering guarantees, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For message ordering guarantees, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Message Ordering Guarantees</div>
          <p className="mt-2">
            Strong non-functional examples must go beyond toggles and raw JSON. They need a review layer that makes the
            operational contract visible: what is being protected, what degrades first, and what evidence an operator
            or reviewer should use before changing policy.
          </p>
        </div>
      </section>

</main>
  );
}
