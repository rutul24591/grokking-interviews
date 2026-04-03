"use client";

import { useMemo, useState } from "react";
import { socketSessions, websocketPolicies, websocketRecovery } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [queueFlushRequested, setQueueFlushRequested] = useState(false);
  const [manualReconnect, setManualReconnect] = useState(false);
  const session = socketSessions[selected];

  const transportPlan = useMemo(() => {
    if (session.connectionState === "closed") return "Socket is closed. Preserve queued outbound actions and require a manual reconnect or controlled repair flow.";
    if (session.connectionState === "reconnecting") return "Reconnect is in progress. Restore room subscriptions before replaying outbound actions.";
    return queueFlushRequested ? "Flush outbound actions only after heartbeat and subscription checks pass." : "Connection is healthy. Keep bidirectional actions live and monitor queue depth.";
  }, [queueFlushRequested, session]);

  const lagBanner = useMemo(() => {
    if (manualReconnect) return "Manual reconnect requested. Keep UI actions queued and confirm room re-subscription before resuming live traffic.";
    if (session.heartbeatLagMs > 1000) return "Heartbeat lag is elevated. Degrade optimistic UI and warn about stale transport state.";
    return `Heartbeat lag ${session.heartbeatLagMs}ms with reconnect mode ${session.reconnectMode}.`;
  }, [manualReconnect, session]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Real-time features</p>
        <h1 className="mt-2 text-3xl font-semibold">WebSockets transport console</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Review transport health, queue replay, room subscription recovery, and degraded WebSocket behavior.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {socketSessions.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={queueFlushRequested} onChange={(event) => setQueueFlushRequested(event.target.checked)} /> Flush queued actions</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={manualReconnect} onChange={(event) => setManualReconnect(event.target.checked)} /> Manual reconnect</label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Socket snapshot</div>
                <p className="mt-2">Room: {session.room}</p>
                <p className="mt-2">Connection: {session.connectionState}</p>
                <p className="mt-2">Subscriptions: {session.subscriptionCount}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Queue and heartbeat</div>
                <p className="mt-2">Outbound queue: {session.outboundQueue}</p>
                <p className="mt-2">Heartbeat lag: {session.heartbeatLagMs}ms</p>
                <p className="mt-2">Reconnect mode: {session.reconnectMode}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Transport plan</div><p className="mt-2">{transportPlan}</p></div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Lag banner</div><p className="mt-2">{lagBanner}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Policies</div><ul className="mt-2 space-y-2">{websocketPolicies.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recovery</div><ul className="mt-2 space-y-2">{websocketRecovery.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
