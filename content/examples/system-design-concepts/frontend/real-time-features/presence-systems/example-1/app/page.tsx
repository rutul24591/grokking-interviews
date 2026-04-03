"use client";

import { useMemo, useState } from "react";
import { presencePolicies, presenceRecovery, presenceRooms } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [showStaleUsers, setShowStaleUsers] = useState(true);
  const [manualCleanup, setManualCleanup] = useState(false);
  const [handoffRequested, setHandoffRequested] = useState(false);
  const room = presenceRooms[selected];

  const rosterSummary = useMemo(() => {
    if (room.syncState === "repair") return "Presence service is recovering. Freeze high-confidence actions such as assign-owner or handoff until heartbeats stabilize.";
    if (manualCleanup && room.staleUsers > 0) return `Manual cleanup will hide ${room.staleUsers} stale user(s) after the current grace period expires.`;
    return `${room.activeUsers} active, ${room.idleUsers} idle, ${showStaleUsers ? room.staleUsers + " stale visible" : "stale hidden"}.`;
  }, [manualCleanup, room, showStaleUsers]);

  const heartbeatAdvice = useMemo(() => {
    if (room.heartbeatSeconds > 30) return "Heartbeat cadence is too slow for precise live presence. Mark the room as degraded and avoid rapid presence transitions.";
    if (room.syncState === "lagging") return "Lagging heartbeats require debounced status changes and last-seen annotations.";
    return "Heartbeat cadence is acceptable for active/idle transitions.";
  }, [room]);

  const handoffPolicy = useMemo(() => {
    if (!handoffRequested) return "No active handoff. Keep routing and ownership controls available only to confirmed active users.";
    if (room.syncState === "repair") return "Block ownership handoff until presence converges. Otherwise the assignee may already be gone.";
    if (room.staleUsers > 0) return "Handoff is risky while stale users are still visible. Require cleanup or explicit confirmation first.";
    return "Presence is stable enough for owner reassignment and room-level escalation.";
  }, [handoffRequested, room]);

  const rosterBreakdown = useMemo(() => [
    { label: "Active", value: room.activeUsers, note: "eligible for live actions" },
    { label: "Idle", value: room.idleUsers, note: "visible but de-prioritized for routing" },
    { label: "Stale", value: room.staleUsers, note: showStaleUsers ? "still shown with last-seen markers" : "hidden from primary roster" }
  ], [room, showStaleUsers]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-teal-300">Real-time features</p>
        <h1 className="mt-2 text-3xl font-semibold">Presence systems console</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Review heartbeat cadence, idle thresholds, stale-user cleanup, and degraded presence behavior.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {presenceRooms.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={showStaleUsers} onChange={(event) => setShowStaleUsers(event.target.checked)} /> Show stale users</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={manualCleanup} onChange={(event) => setManualCleanup(event.target.checked)} /> Queue stale cleanup</label>
            </div>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={handoffRequested} onChange={(event) => setHandoffRequested(event.target.checked)} /> Request owner handoff</label>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Room snapshot</div>
                <p className="mt-2">Active: {room.activeUsers}</p>
                <p className="mt-2">Idle: {room.idleUsers}</p>
                <p className="mt-2">Stale: {room.staleUsers}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Presence timing</div>
                <p className="mt-2">Heartbeat: {room.heartbeatSeconds}s</p>
                <p className="mt-2">Away threshold: {room.awayThresholdMinutes}m</p>
                <p className="mt-2">Sync state: {room.syncState}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Roster summary</div><p className="mt-2">{rosterSummary}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Roster lanes</div>
              <ul className="mt-2 space-y-2">
                {rosterBreakdown.map((item) => <li key={item.label}><span className="font-medium text-slate-100">{item.label}:</span> {item.value} · {item.note}</li>)}
              </ul>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Heartbeat advice</div><p className="mt-2">{heartbeatAdvice}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Handoff policy</div><p className="mt-2">{handoffPolicy}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Policies</div><ul className="mt-2 space-y-2">{presencePolicies.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recovery</div><ul className="mt-2 space-y-2">{presenceRecovery.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
