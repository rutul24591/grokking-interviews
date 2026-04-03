"use client";

import { useEffect, useState } from "react";

import { ReviewNote } from "../components/ReviewNote";

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { ...init, headers: { 'content-type': 'application/json', ...(init?.headers || {}) } });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `${res.status}`);
  return (text ? JSON.parse(text) : null) as T;
}

export default function Page() {
  const [amountUsd, setAmountUsd] = useState(49);
  const [snapshotId, setSnapshotId] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  async function refresh() {
    setStatus(await json('/api/dr/status'));
  }

  useEffect(() => { refresh().catch(() => {}); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Disaster Recovery Console</h1>
        <p className="text-sm text-slate-300">Simulate order writes, take snapshots, trigger a primary outage, and validate restore behavior.</p>
      </header>
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 space-y-3">
          <label className="space-y-1 text-sm"><div className="text-slate-300">Order amount</div><input className="w-full rounded border border-slate-700 bg-slate-950/40 px-3 py-2" type="number" value={amountUsd} onChange={(e) => setAmountUsd(Number(e.target.value))} /></label>
          <label className="space-y-1 text-sm"><div className="text-slate-300">Snapshot id to restore</div><input className="w-full rounded border border-slate-700 bg-slate-950/40 px-3 py-2" value={snapshotId} onChange={(e) => setSnapshotId(e.target.value)} /></label>
          <div className="flex flex-wrap gap-2">
            <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={async () => { setError(''); try { setResult(await json('/api/orders', { method: 'POST', body: JSON.stringify({ amountUsd }) })); await refresh(); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } }}>Create order</button>
            <button className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500" onClick={async () => { setResult(await json('/api/dr/snapshot', { method: 'POST', body: '{}' })); await refresh(); }}>Take snapshot</button>
            <button className="rounded bg-amber-600 px-4 py-2 text-sm font-semibold hover:bg-amber-500" onClick={async () => { setResult(await json('/api/dr/outage', { method: 'POST', body: '{}' })); await refresh(); }}>Trigger outage</button>
            <button className="rounded bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-500" onClick={async () => { setError(''); try { setResult(await json('/api/dr/restore', { method: 'POST', body: JSON.stringify({ snapshotId }) })); await refresh(); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } }}>Restore</button>
          </div>
          {error ? <div className="rounded border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}
          <button className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700" onClick={() => refresh().catch(() => {})}>Refresh status</button>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded border border-slate-800 bg-black/30 p-3"><div className="text-xs text-slate-400">Primary up</div><div className="mt-1 text-xl font-semibold">{status ? String(status.status.primaryUp) : '—'}</div></div>
            <div className="rounded border border-slate-800 bg-black/30 p-3"><div className="text-xs text-slate-400">Orders</div><div className="mt-1 text-xl font-semibold">{status?.status.primaryOrders ?? '—'}</div></div>
            <div className="rounded border border-slate-800 bg-black/30 p-3"><div className="text-xs text-slate-400">Snapshots</div><div className="mt-1 text-xl font-semibold">{status?.status.snapshots?.length ?? '—'}</div></div>
          </div>
          <pre className="overflow-auto rounded bg-black/40 p-3 text-xs text-slate-100">{JSON.stringify({ status, result }, null, 2)}</pre>
        </div>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether disaster recovery strategy is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For disaster recovery strategy, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For disaster recovery strategy, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For disaster recovery strategy, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Disaster Recovery Strategy</div>
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
