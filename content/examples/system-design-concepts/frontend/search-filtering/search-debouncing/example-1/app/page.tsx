"use client";

import { useMemo, useState } from "react";
import { debouncePolicies, debounceRecovery, debounceSessions } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [showPendingState, setShowPendingState] = useState(true);
  const [manualCancel, setManualCancel] = useState(false);
  const [freezeTyping, setFreezeTyping] = useState(false);
  const scenario = debounceSessions[selected];

  const requestPlan = useMemo(() => {
    if (scenario.cancellationState === "missing") return "Debouncing is incomplete. Reject stale responses by query id before trusting any rendered result set.";
    if (scenario.requestState === "lagging") return "Keep a visible pending state, coalesce typing bursts, and avoid rendering intermediate results that will be replaced immediately.";
    return manualCancel ? "Manual cancellation is armed. Abort the obsolete request before the next query leaves the client." : "Debounce and cancellation are aligned for steady live search.";
  }, [manualCancel, scenario]);

  const qaDecision = useMemo(() => {
    if (freezeTyping && scenario.requestState !== "healthy") return "Freeze interactive rollout. The current search bar still hides a request-ordering issue under typing bursts.";
    if (!showPendingState && scenario.requestState !== "healthy") return "Do not ship. Pending state is required when the request path is already near its latency budget.";
    return scenario.releaseAction;
  }, [freezeTyping, scenario, showPendingState]);

  const requestSnapshot = useMemo(
    () => [
      { label: "Debounce", value: `${scenario.debounceMs}ms`, note: `${scenario.keystrokeBurst} keystrokes in burst` },
      { label: "In-flight requests", value: String(scenario.inflightRequests), note: `${scenario.lastPaintMs}ms last paint` },
      { label: "Backend budget", value: `${scenario.backendBudgetMs}ms`, note: scenario.cancellationState }
    ],
    [scenario]
  );

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-rose-300">Search filtering</p>
        <h1 className="mt-2 text-3xl font-semibold">Search debouncing release review</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Evaluate typing bursts, request cancellation, pending-state visibility, and release readiness for live search.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {debounceSessions.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={showPendingState} onChange={(event) => setShowPendingState(event.target.checked)} /> Show pending state</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={manualCancel} onChange={(event) => setManualCancel(event.target.checked)} /> Force cancel previous request</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={freezeTyping} onChange={(event) => setFreezeTyping(event.target.checked)} /> Freeze rollout on burst regression</label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Request plan</div><p className="mt-2">{requestPlan}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Request snapshot</div><ul className="mt-2 space-y-2">{requestSnapshot.map((item) => <li key={item.label}><span className="font-medium text-slate-100">{item.label}:</span> {item.value} · {item.note}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">QA focus</div><ul className="mt-2 space-y-2">{scenario.qaFocus.map((item) => <li key={item}>• {item}</li>)}</ul></div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">QA decision</div><p className="mt-2">{qaDecision}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Policies</div><ul className="mt-2 space-y-2">{debouncePolicies.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recovery</div><ul className="mt-2 space-y-2">{debounceRecovery.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
