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
  const [keysText, setKeysText] = useState(`user-1\nuser-2\nuser-3\nuser-4`);
  const [shards, setShards] = useState(4);
  const [state, setState] = useState<any>(null);
  const [error, setError] = useState('');

  async function refresh() { setState(await json('/api/cluster/state')); }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      <header className="space-y-2"><h1 className="text-3xl font-bold">Cluster Scaling Workbench</h1><p className="text-sm text-slate-300">Resize the shard count, assign keys with rendezvous hashing, and inspect how many assignments move.</p></header>
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 space-y-3">
          <label className="space-y-1 text-sm"><div className="text-slate-300">Keys</div><textarea rows={8} className="w-full rounded border border-slate-700 bg-slate-950/40 px-3 py-2 font-mono text-xs" value={keysText} onChange={(e) => setKeysText(e.target.value)} /></label>
          <label className="space-y-1 text-sm"><div className="text-slate-300">Shards</div><input type="number" className="w-full rounded border border-slate-700 bg-slate-950/40 px-3 py-2" value={shards} onChange={(e) => setShards(Number(e.target.value))} /></label>
          <div className="flex flex-wrap gap-2">
            <button className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500" onClick={async () => { setError(''); try { setState(await json('/api/cluster/resize', { method: 'POST', body: JSON.stringify({ shards }) })); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } }}>Resize</button>
            <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={async () => { setError(''); try { setState(await json('/api/cluster/assign', { method: 'POST', body: JSON.stringify({ keys: keysText.split(/\n+/).map((k) => k.trim()).filter(Boolean) }) })); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } }}>Assign keys</button>
            <button className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700" onClick={() => refresh().catch(() => {})}>Refresh state</button>
          </div>
          {error ? <div className="rounded border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}
        </div>
        <pre className="overflow-auto rounded-xl border border-slate-700 bg-black/40 p-4 text-xs text-slate-100">{JSON.stringify(state, null, 2)}</pre>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether scalability strategy is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For scalability strategy, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For scalability strategy, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For scalability strategy, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Scalability Strategy</div>
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
