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
  const [sub, setSub] = useState('service:checkout');
  const [token, setToken] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      <header className="space-y-2"><h1 className="text-3xl font-bold">Key Rotation Console</h1><p className="text-sm text-slate-300">Issue signed tokens, verify them, and rotate the active signing key without exposing secret material.</p></header>
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 space-y-3">
          <label className="space-y-1 text-sm"><div className="text-slate-300">Subject</div><input className="w-full rounded border border-slate-700 bg-slate-950/40 px-3 py-2" value={sub} onChange={(e) => setSub(e.target.value)} /></label>
          <label className="space-y-1 text-sm"><div className="text-slate-300">Token</div><textarea rows={5} className="w-full rounded border border-slate-700 bg-slate-950/40 px-3 py-2 font-mono text-xs" value={token} onChange={(e) => setToken(e.target.value)} /></label>
          <div className="flex flex-wrap gap-2">
            <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={async () => { setError(''); try { const r:any = await json('/api/tokens/issue', { method: 'POST', body: JSON.stringify({ sub }) }); setToken(r.token); setResult(r); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } }}>Issue token</button>
            <button className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500" onClick={async () => { setError(''); try { setResult(await json('/api/tokens/verify', { method: 'POST', body: JSON.stringify({ token }) })); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } }}>Verify token</button>
            <button className="rounded bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-500" onClick={async () => { setResult(await json('/api/secrets/rotate', { method: 'POST', body: '{}' })); }}>Rotate key</button>
          </div>
          {error ? <div className="rounded border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}
        </div>
        <pre className="overflow-auto rounded-xl border border-slate-700 bg-black/40 p-4 text-xs text-slate-100">{JSON.stringify(result, null, 2)}</pre>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether secrets management is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For secrets management, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For secrets management, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For secrets management, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Secrets Management</div>
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
