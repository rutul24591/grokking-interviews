"use client";

import { useMemo, useState } from "react";

import { ReviewNote } from "../components/ReviewNote";

type Estimate = {
  ok: boolean;
  breakdown: {
    requestCostUsd: number;
    egressCostUsd: number;
    storageCostUsd: number;
    totalUsd: number;
    budgetUsd: number;
    withinBudget: boolean;
  };
};

const presets = {
  baseline: { monthlyRequests: 80_000_000, avgResponseKb: 18, cacheHitRate: 0.72, originComputeUsdPerMillion: 0.9, reservedDiscount: 0.15, cdnEgressUsdPerGb: 0.06, storageGb: 950, storageUsdPerGbMonth: 0.021, budgetUsd: 6_500 },
  launch: { monthlyRequests: 220_000_000, avgResponseKb: 28, cacheHitRate: 0.54, originComputeUsdPerMillion: 1.1, reservedDiscount: 0.1, cdnEgressUsdPerGb: 0.07, storageGb: 1_800, storageUsdPerGbMonth: 0.021, budgetUsd: 12_000 },
};

async function estimate(body: unknown): Promise<Estimate> {
  const res = await fetch('/api/cost/estimate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<Estimate>;
}

export default function Page() {
  const [scenario, setScenario] = useState(presets.baseline);
  const [result, setResult] = useState<Estimate | null>(null);
  const [error, setError] = useState('');
  const withinBudget = useMemo(() => result?.breakdown.withinBudget ?? null, [result]);

  async function run() {
    setError('');
    try {
      setResult(await estimate(scenario));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Cost Optimization Review</h1>
        <p className="text-sm text-slate-300">Model request, egress, and storage spend, then test whether a workload stays within budget.</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
          <div className="flex gap-2">
            <button className="rounded bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700" onClick={() => setScenario(presets.baseline)}>Baseline</button>
            <button className="rounded bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700" onClick={() => setScenario(presets.launch)}>Launch spike</button>
            <button className="ml-auto rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={run}>Estimate monthly cost</button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(scenario).map(([key, value]) => (
              <label key={key} className="space-y-1 text-sm">
                <div className="text-slate-300">{key}</div>
                <input className="w-full rounded border border-slate-700 bg-slate-950/40 px-3 py-2" value={String(value)} onChange={(e) => setScenario((prev) => ({ ...prev, [key]: Number(e.target.value) }))} />
              </label>
            ))}
          </div>
          {error ? <div className="rounded border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
          <h2 className="text-lg font-semibold">Decision</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded border border-slate-800 bg-black/30 p-3"><div className="text-xs text-slate-400">Total</div><div className="mt-1 text-2xl font-bold">{result ? `$${result.breakdown.totalUsd.toFixed(0)}` : '—'}</div></div>
            <div className="rounded border border-slate-800 bg-black/30 p-3"><div className="text-xs text-slate-400">Budget</div><div className="mt-1 text-2xl font-bold">{result ? `$${result.breakdown.budgetUsd.toFixed(0)}` : '—'}</div></div>
            <div className="rounded border border-slate-800 bg-black/30 p-3"><div className="text-xs text-slate-400">Request cost</div><div className="mt-1 text-xl font-semibold">{result ? `$${result.breakdown.requestCostUsd.toFixed(0)}` : '—'}</div></div>
            <div className="rounded border border-slate-800 bg-black/30 p-3"><div className="text-xs text-slate-400">Egress + storage</div><div className="mt-1 text-xl font-semibold">{result ? `$${(result.breakdown.egressCostUsd + result.breakdown.storageCostUsd).toFixed(0)}` : '—'}</div></div>
          </div>
          <div className={`rounded border p-3 text-sm ${withinBudget ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100' : 'border-amber-500/30 bg-amber-500/10 text-amber-100'}`}>
            {withinBudget == null ? 'Run an estimate to see whether the plan is sustainable.' : withinBudget ? 'Scenario is within budget. Use this as the baseline for release planning.' : 'Scenario exceeds budget. Increase cache hit rate, trim payload size, or change serving tier before launch.'}
          </div>
          <pre className="overflow-auto rounded bg-black/40 p-3 text-xs text-slate-100">{JSON.stringify(result, null, 2)}</pre>
        </div>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether cost optimization is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For cost optimization, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For cost optimization, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For cost optimization, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Cost Optimization</div>
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
