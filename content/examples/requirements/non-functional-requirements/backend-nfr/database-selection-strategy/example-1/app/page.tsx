"use client";

import { useState } from "react";

import { ReviewNote } from "../components/ReviewNote";

type Result = { ok: true; recommendation: { primary: string; ranked: { candidate: string; score: number; reasons: string[] }[] } };

const presets = {
  transactional: { readsPerSecond: 1800, writesPerSecond: 700, maxP95LatencyMs: 30, requiresStrongConsistency: true, needsFullTextSearch: false, needsGraphQueries: false, dataSizeGb: 180, multiRegion: false },
  searchHeavy: { readsPerSecond: 12000, writesPerSecond: 900, maxP95LatencyMs: 80, requiresStrongConsistency: false, needsFullTextSearch: true, needsGraphQueries: false, dataSizeGb: 900, multiRegion: true },
  graphHeavy: { readsPerSecond: 500, writesPerSecond: 150, maxP95LatencyMs: 50, requiresStrongConsistency: false, needsFullTextSearch: false, needsGraphQueries: true, dataSizeGb: 120, multiRegion: false },
};

async function recommend(body: unknown): Promise<Result> {
  const res = await fetch('/api/recommend', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<Result>;
}

export default function Page() {
  const [profile, setProfile] = useState(presets.transactional);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Database Selection Workbench</h1>
        <p className="text-sm text-slate-300">Compare workload profiles and review a ranked recommendation instead of a single hard-coded answer.</p>
      </header>
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            <button className="rounded bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700" onClick={() => setProfile(presets.transactional)}>Transactional</button>
            <button className="rounded bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700" onClick={() => setProfile(presets.searchHeavy)}>Search heavy</button>
            <button className="rounded bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700" onClick={() => setProfile(presets.graphHeavy)}>Graph heavy</button>
            <button className="ml-auto rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={async () => { setError(''); try { setResult(await recommend(profile)); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } }}>Recommend</button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            {Object.entries(profile).map(([key, value]) => typeof value === 'boolean' ? (
              <label key={key} className="flex items-center gap-2 rounded border border-slate-800 bg-black/20 px-3 py-2">
                <input type="checkbox" checked={value} onChange={(e) => setProfile((prev) => ({ ...prev, [key]: e.target.checked }))} />
                <span>{key}</span>
              </label>
            ) : (
              <label key={key} className="space-y-1">
                <div className="text-slate-300">{key}</div>
                <input className="w-full rounded border border-slate-700 bg-slate-950/40 px-3 py-2" value={String(value)} onChange={(e) => setProfile((prev) => ({ ...prev, [key]: Number(e.target.value) }))} />
              </label>
            ))}
          </div>
          {error ? <div className="rounded border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
          <h2 className="text-lg font-semibold">Ranking</h2>
          {result ? (
            <>
              <div className="rounded border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">Primary recommendation: <span className="font-semibold">{result.recommendation.primary}</span></div>
              <div className="space-y-3">
                {result.recommendation.ranked.map((item) => (
                  <div key={item.candidate} className="rounded border border-slate-800 bg-black/30 p-3">
                    <div className="flex items-center justify-between gap-3"><div className="font-semibold text-slate-100">{item.candidate}</div><div className="text-sm text-slate-300">score {item.score}</div></div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">{item.reasons.map((reason, idx) => <li key={idx}>{reason}</li>)}</ul>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="text-sm text-slate-400">Run a recommendation to inspect the trade-offs.</div>}
        </div>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether database selection strategy is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For database selection strategy, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For database selection strategy, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For database selection strategy, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Database Selection Strategy</div>
          <p className="mt-2">
            Strong non-functional examples must go beyond toggles and raw JSON. They need a review layer that makes the
            operational contract visible: what is being protected, what degrades first, and what evidence an operator
            or reviewer should use before changing policy.
          </p>
        </div>
      </section>


      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Decision rubric</h2>
          <p className="mt-1 text-sm text-slate-400">
            Use this rubric to judge whether database selection strategy is ready for production review. The point is not simply to see a
            successful response, but to confirm the example explains the operational tradeoffs that senior engineers
            would debate during design review, rollout approval, or incident response.
          </p>
          <p className="mt-3 text-sm text-slate-400">
            A strong non-functional example should make the protection boundary, the degraded path, and the operator's
            next safe action obvious. If those three things are hidden, the workflow is still too shallow.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Primary signal"
            detail="For database selection strategy, verify that the UI exposes the one or two signals an operator would trust first when deciding whether the system is healthy."
          />
          <ReviewNote
            title="Safe fallback"
            detail="For database selection strategy, validate that the fallback path is explicit, bounded, and consistent with the business priority rather than an accidental side effect."
          />
          <ReviewNote
            title="Review evidence"
            detail="For database selection strategy, confirm that the output is detailed enough for another engineer to audit the behavior without re-running the scenario from scratch."
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
            <div className="font-semibold text-white">Questions to ask in review</div>
            <ul className="mt-3 space-y-2 text-slate-400">
              <li>• What fails first when demand, latency, or invalid input spikes?</li>
              <li>• Which state transitions are safe to retry and which require human intervention?</li>
              <li>• How does the operator know the fallback reduced risk instead of hiding it?</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
            <div className="font-semibold text-white">Why this matters for Database Selection Strategy</div>
            <p className="mt-3">
              These checks push the example beyond a static demo. They turn it into a review artifact that teaches the
              production contract, the recovery posture, and the evidence needed to defend the design under scrutiny.
            </p>
          </div>
        </div>
      </section>

</main>
  );
}
