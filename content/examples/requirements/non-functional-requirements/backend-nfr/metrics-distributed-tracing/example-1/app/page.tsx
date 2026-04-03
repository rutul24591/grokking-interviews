"use client";

import { useState } from "react";

import { ReviewNote } from "../components/ReviewNote";

async function runDemo(traceparent?: string) {
  const headers: Record<string, string> = {};
  if (traceparent) headers.traceparent = traceparent;
  const res = await fetch('/api/demo', { headers, cache: 'no-store' });
  const body = await res.json();
  const traces = await fetch('/api/traces', { cache: 'no-store' }).then((r) => r.json());
  return { demo: body, responseTraceparent: res.headers.get('traceparent'), traces };
}

export default function Page() {
  const [traceparent, setTraceparent] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      <header className="space-y-2"><h1 className="text-3xl font-bold">Tracing Sandbox</h1><p className="text-sm text-slate-300">Exercise trace propagation, inspect generated spans, and compare the emitted traceparent with captured spans.</p></header>
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 space-y-3">
          <label className="space-y-1 text-sm"><div className="text-slate-300">Incoming traceparent (optional)</div><input className="w-full rounded border border-slate-700 bg-slate-950/40 px-3 py-2 font-mono text-xs" value={traceparent} onChange={(e) => setTraceparent(e.target.value)} placeholder="00-<trace>-<span>-01" /></label>
          <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={async () => { setError(''); try { setResult(await runDemo(traceparent || undefined)); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } }}>Run traced request</button>
          {error ? <div className="rounded border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}
        </div>
        <pre className="overflow-auto rounded-xl border border-slate-700 bg-black/40 p-4 text-xs text-slate-100">{JSON.stringify(result, null, 2)}</pre>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether metrics distributed tracing is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For metrics distributed tracing, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For metrics distributed tracing, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For metrics distributed tracing, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Metrics Distributed Tracing</div>
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
