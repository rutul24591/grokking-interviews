"use client";

import { useMemo, useState } from "react";
import { sseChannels, ssePolicies, sseRecovery } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [streamOpen, setStreamOpen] = useState(true);
  const [manualReplay, setManualReplay] = useState(false);
  const [catchupMode, setCatchupMode] = useState(false);
  const channel = sseChannels[selected];

  const streamBanner = useMemo(() => {
    if (!streamOpen) return "Connection is closed. Preserve the last event id and surface a reconnect action instead of silently freezing updates.";
    if (channel.streamHealth === "repair") return "Stream is recovering. Replay missed events from the last event id before re-entering live mode.";
    if (channel.replayGap > 0 || manualReplay) return `Replay ${channel.replayGap || 1} event(s) from ${channel.lastEventId} before streaming live again.`;
    return "SSE connection is healthy. Apply incremental updates and keep a visible last-event marker.";
  }, [channel, manualReplay, streamOpen]);

  const bufferingAdvice = useMemo(() => {
    if (channel.bufferedEvents >= 5) return `Hold ${channel.bufferedEvents} buffered events behind a catch-up badge to avoid UI churn.`;
    return `Retry interval ${channel.retryMs}ms with last event id ${channel.lastEventId}.`;
  }, [channel]);

  const replayPlan = useMemo(() => {
    if (!streamOpen) return "Closed stream: persist the last event id and wait for explicit reconnect before resuming replay.";
    if (catchupMode || channel.replayGap > 0) return "Enter catch-up mode, replay missing events in order, and suppress live inserts until the gap closes.";
    if (channel.streamHealth === "repair") return "Show reconnect backoff and checkpoint replay before switching the badge back to live.";
    return "No replay gap. Apply single events or micro-batches directly to the live UI.";
  }, [catchupMode, channel, streamOpen]);

  const streamLanes = useMemo(() => [
    { label: "Live", value: channel.streamHealth === "healthy" ? "active" : "degraded", note: "single events flow inline" },
    { label: "Replay", value: channel.replayGap, note: channel.replayGap > 0 ? "missed events need replay" : "no backlog" },
    { label: "Buffer", value: channel.bufferedEvents, note: channel.bufferedEvents >= 5 ? "apply grouped update" : "small inline buffer" }
  ], [channel]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-rose-300">Real-time features</p>
        <h1 className="mt-2 text-3xl font-semibold">Server-Sent Events console</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Model reconnects, replay gaps, last-event-id recovery, and buffered event application for SSE-driven feeds.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {sseChannels.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={streamOpen} onChange={(event) => setStreamOpen(event.target.checked)} /> Stream open</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={manualReplay} onChange={(event) => setManualReplay(event.target.checked)} /> Force replay</label>
            </div>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={catchupMode} onChange={(event) => setCatchupMode(event.target.checked)} /> Apply catch-up mode</label>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Channel</div>
                <p className="mt-2">Event type: {channel.eventType}</p>
                <p className="mt-2">Last event id: {channel.lastEventId}</p>
                <p className="mt-2">Retry: {channel.retryMs}ms</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Health</div>
                <p className="mt-2">State: {channel.streamHealth}</p>
                <p className="mt-2">Replay gap: {channel.replayGap}</p>
                <p className="mt-2">Buffered events: {channel.bufferedEvents}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Stream banner</div><p className="mt-2">{streamBanner}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Replay plan</div><p className="mt-2">{replayPlan}</p></div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Buffering advice</div><p className="mt-2">{bufferingAdvice}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Stream lanes</div>
              <ul className="mt-2 space-y-2">
                {streamLanes.map((item) => <li key={item.label}><span className="font-medium text-slate-100">{item.label}:</span> {item.value} · {item.note}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Policies</div><ul className="mt-2 space-y-2">{ssePolicies.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recovery</div><ul className="mt-2 space-y-2">{sseRecovery.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
