"use client";

import { useMemo, useState } from "react";
import { feedPolicies, feedRecovery, feedSessions } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [pauseLive, setPauseLive] = useState(false);
  const feed = feedSessions[selected];

  const freshnessBanner = useMemo(() => {
    if (pauseLive) return "Live mode is paused. Preserve the current scroll position and queue new items behind a resume gate.";
    if (feed.backlogState === "repair") return "Feed is recovering. Offer replay from checkpoint and mark the timeline as stale until caught up.";
    if (feed.freshnessSeconds > 10) return "Feed is delayed. Group bursts and show jump-to-latest instead of forcing new items into view.";
    return "Feed is fresh. Keep incremental inserts visible without disrupting focused reading.";
  }, [feed, pauseLive]);

  const batchGuidance = useMemo(() => {
    if (feed.pendingItems >= 6) return `Hold ${feed.pendingItems} queued items behind a grouped update badge.`;
    return `Current batching mode: ${feed.batchingMode}.`; 
  }, [feed]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Real-time features</p>
        <h1 className="mt-2 text-3xl font-semibold">Live updates feed console</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Model freshness, replay, batching, and list stability for a continuously updating event feed.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {feedSessions.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={autoScroll} onChange={(event) => setAutoScroll(event.target.checked)} /> Auto-scroll to latest</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={pauseLive} onChange={(event) => setPauseLive(event.target.checked)} /> Pause live stream</label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Feed snapshot</div>
                <p className="mt-2">Channel: {feed.channel}</p>
                <p className="mt-2">Freshness: {feed.freshnessSeconds}s</p>
                <p className="mt-2">Pending items: {feed.pendingItems}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">User context</div>
                <p className="mt-2">Pinned filter: {feed.pinnedFilter}</p>
                <p className="mt-2">Auto-scroll: {autoScroll ? "enabled" : "disabled"}</p>
                <p className="mt-2">Backlog: {feed.backlogState}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Freshness banner</div><p className="mt-2">{freshnessBanner}</p></div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Batch guidance</div><p className="mt-2">{batchGuidance}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Policies</div><ul className="mt-2 space-y-2">{feedPolicies.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recovery</div><ul className="mt-2 space-y-2">{feedRecovery.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
