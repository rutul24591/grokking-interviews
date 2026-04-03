"use client";

import { useEffect, useMemo, useState } from "react";

import { ReviewNote } from "../components/ReviewNote";

async function json<T>(input: RequestInfo | URL): Promise<T> {
  const res = await fetch(input, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export default function Page() {
  const [report, setReport] = useState<any>(null);
  const [levelFilter, setLevelFilter] = useState<'all' | 'error' | 'warn'>('all');
  const [error, setError] = useState('');

  async function refresh() {
    try { setReport(await json('/api/lint')); setError(''); } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
  }

  useEffect(() => { refresh(); }, []);

  const findings = useMemo(() => {
    if (!report?.findings) return [];
    return levelFilter === 'all' ? report.findings : report.findings.filter((item: any) => item.level === levelFilter);
  }, [report, levelFilter]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      <header className="space-y-2"><h1 className="text-3xl font-bold">Documentation Quality Gate</h1><p className="text-sm text-slate-300">Audit docs for required sections, ownership metadata, and runnable runbooks. Use the report to decide whether a release can pass the quality gate.</p></header>
      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
          <div className="flex gap-2">
            <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={() => refresh().catch(() => {})}>Refresh audit</button>
            <button className="rounded bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700" onClick={() => setLevelFilter('all')}>All</button>
            <button className="rounded bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700" onClick={() => setLevelFilter('error')}>Errors</button>
            <button className="rounded bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700" onClick={() => setLevelFilter('warn')}>Warnings</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded border border-slate-800 bg-black/30 p-3"><div className="text-xs text-slate-400">Docs scanned</div><div className="mt-1 text-xl font-semibold">{report?.files?.length ?? '—'}</div></div>
            <div className="rounded border border-slate-800 bg-black/30 p-3"><div className="text-xs text-slate-400">Errors</div><div className="mt-1 text-xl font-semibold">{report?.errors ?? '—'}</div></div>
            <div className="rounded border border-slate-800 bg-black/30 p-3"><div className="text-xs text-slate-400">Warnings</div><div className="mt-1 text-xl font-semibold">{report?.warns ?? '—'}</div></div>
          </div>
          {error ? <div className="rounded border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 space-y-3">
          <h2 className="text-lg font-semibold">Findings</h2>
          <div className="space-y-3 max-h-[32rem] overflow-auto pr-1">
            {findings.map((item: any, idx: number) => (
              <div key={idx} className="rounded border border-slate-800 bg-black/30 p-3 text-sm">
                <div className="flex items-center justify-between gap-2"><div className="font-medium text-slate-100">{item.file}</div><div className="rounded bg-slate-800 px-2 py-1 text-xs uppercase">{item.level}</div></div>
                <div className="mt-2 text-slate-300">{item.message}</div>
              </div>
            ))}
            {!findings.length ? <div className="text-sm text-slate-400">No findings for the selected filter.</div> : null}
          </div>
        </div>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether documentation quality is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For documentation quality, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For documentation quality, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For documentation quality, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Documentation Quality</div>
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
            Use this rubric to judge whether documentation quality is ready for production review. The point is not simply to see a
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
            detail="For documentation quality, verify that the UI exposes the one or two signals an operator would trust first when deciding whether the system is healthy."
          />
          <ReviewNote
            title="Safe fallback"
            detail="For documentation quality, validate that the fallback path is explicit, bounded, and consistent with the business priority rather than an accidental side effect."
          />
          <ReviewNote
            title="Review evidence"
            detail="For documentation quality, confirm that the output is detailed enough for another engineer to audit the behavior without re-running the scenario from scratch."
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
            <div className="font-semibold text-white">Why this matters for Documentation Quality</div>
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
