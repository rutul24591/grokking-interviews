"use client";

import { useMemo, useState } from "react";
import { networkPractices, networkRecovery, networkSessions } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [prefetchEnabled, setPrefetchEnabled] = useState(true);
  const [autoplayEnabled, setAutoplayEnabled] = useState(false);
  const session = networkSessions[selected];

  const transportPlan = useMemo(() => {
    if (session.saveData) return "Switch to text-first payloads, disable autoplay, and prefetch only after explicit user intent.";
    if (session.latencyMs > 220) return "Batch API requests, prefetch one likely route, and downgrade media until latency stabilizes.";
    return prefetchEnabled ? "Allow route prefetch and progressive image upgrades with a capped candidate set." : "Hold prefetch and spend bandwidth on the active reading path only.";
  }, [prefetchEnabled, session]);

  const mediaDecision = useMemo(() => {
    if (session.saveData && autoplayEnabled) return "Autoplay conflicts with Save-Data and should be disabled immediately.";
    if (session.mediaPolicy === "summary-only") return "Serve summary cards first and lazily fetch rich metadata on demand.";
    return `Current media policy: ${session.mediaPolicy}.`;
  }, [autoplayEnabled, session]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Mobile considerations</p>
        <h1 className="mt-2 text-3xl font-semibold">Mobile network console</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Model data-saving behavior, request batching, media degradation, and transparent recovery on constrained mobile networks.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {networkSessions.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={prefetchEnabled} onChange={(event) => setPrefetchEnabled(event.target.checked)} /> Allow route prefetch</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={autoplayEnabled} onChange={(event) => setAutoplayEnabled(event.target.checked)} /> Enable autoplay media</label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Network profile</div>
                <p className="mt-2">Latency: {session.latencyMs}ms</p>
                <p className="mt-2">Downlink: {session.downlinkMbps} Mbps</p>
                <p className="mt-2">Save-Data: {session.saveData ? "on" : "off"}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Active load</div>
                <p className="mt-2">Pending requests: {session.pendingRequests}</p>
                <p className="mt-2">Polling: {session.pollingMode}</p>
                <p className="mt-2">Media policy: {session.mediaPolicy}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Transport plan</div><p className="mt-2">{transportPlan}</p></div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Media decision</div><p className="mt-2">{mediaDecision}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Practices</div><ul className="mt-2 space-y-2">{networkPractices.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recovery playbook</div><ul className="mt-2 space-y-2">{networkRecovery.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
